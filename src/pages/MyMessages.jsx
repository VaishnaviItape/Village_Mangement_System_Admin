import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getMyConversations,
  getConversationMessages,
  sendMessageApi,
  answerQuestionApi,
  createConversationApi,
  markMessageAsReadApi,
  getAllUsers,
  getMyTeam,
} from "../services/messagingService";

export default function MessagesPage() {
  const meId = sessionStorage.getItem("userId");
  const meName = sessionStorage.getItem("fullName");

  const [messageList, setMessageList] = useState([]);
  const [filteredMessageList, setFilteredMessageList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [newConvType, setNewConvType] = useState("direct");
  const [newConvTitle, setNewConvTitle] = useState("");
  const [composer, setComposer] = useState({
    type: "normal",
    text: "",
    mcqOptions: [],
  });
  const [detailedAnswers, setDetailedAnswers] = useState({});
  const [recipientMode, setRecipientMode] = useState("users");
  const [users, setUsers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState(new Set());

  const scrollViewport = useRef();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await getMyConversations();
      setMessageList(res.data);
      setFilteredMessageList(res.data);
    } catch {
      toast.error("Failed to load conversations");
    }
  };

  const filterConversations = (q) => {
    setSearchTerm(q);
    const query = q.toLowerCase();
    setFilteredMessageList(
      messageList.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(query) ||
          (c.participants || []).some((p) =>
            p.fullName.toLowerCase().includes(query)
          )
      )
    );
  };

  const openConversation = async (conv) => {
    setSelectedConversation(conv);
    setReplyTo(null);

    try {
      const res = await getConversationMessages(conv.conversationId);
      const messages = res.data;

      const normalized = messages.map((m) => {
        let alreadyAnswered = false;
        let myAnswerYesNo = null;
        let myAnswerMcqLabel = null;
        let myAnswerDetailed = null;

        if (m.question?.answers?.length > 0) {
          const myAns = m.question.answers.find(
            (a) =>
              a.respondentName?.toLowerCase() === meName?.toLowerCase() ||
              a.respondentId === meId
          );
          if (myAns) {
            alreadyAnswered = true;
            myAnswerYesNo = myAns.yesNoValue;
            myAnswerMcqLabel = myAns.mcqOptionLabel || "";
            myAnswerDetailed = myAns.detailedText || "";
          }
        }

        return {
          ...m,
          senderName: m.senderId === meId ? "Me" : m.senderName,
          alreadyAnswered,
          myAnswerYesNo,
          myAnswerMcqLabel,
          myAnswerDetailed,
        };
      });

      setConversationMessages(normalized);

      // ✅ Mark unread messages as read
      normalized
        .filter((m) => !m.isRead)
        .forEach(async (m) => {
          try {
            await markMessageAsReadApi(m.id);
            m.isRead = true;
          } catch (err) {
            console.error("Failed to mark as read", err);
          }
        });

      // ✅ Reset unread badge count for the conversation
      conv.unreadCount = 0;
      setFilteredMessageList([...filteredMessageList]);

      setTimeout(scrollToBottom, 100);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const scrollToBottom = () => {
    if (scrollViewport.current) {
      scrollViewport.current.scrollTop = scrollViewport.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !composer.text || sending) return;

    const body = {
      messageType: composer.type,
      body: composer.text,
      parentMessageId: replyTo?.id || null,
      question:
        composer.type === "mcq"
          ? { questionType: "mcq", required: false, mcqOptions: composer.mcqOptions }
          : composer.type === "yes_no"
            ? { questionType: "yes_no", required: false }
            : composer.type === "detailed"
              ? { questionType: "detailed", required: false }
              : undefined,
    };

    setSending(true);
    try {
      await sendMessageApi(selectedConversation.conversationId, body);
      setComposer({ ...composer, text: "" });
      setReplyTo(null);
      await openConversation(selectedConversation);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const answerYesNo = async (msg, val) => {
    try {
      await answerQuestionApi(msg.question.id, { answerType: "yes_no", yesNoValue: val });
      msg.alreadyAnswered = true;
      msg.myAnswerYesNo = val;
      msg.question.answers = [...(msg.question.answers || []), {
        id: crypto.randomUUID(),
        respondentId: meId,
        respondentName: "Me",
        yesNoValue: val,
      }];
      setConversationMessages([...conversationMessages]);
    } catch {
      toast.error("Failed to answer");
    }
  };

  const answerMcq = async (msg, optionId) => {
    const opt = msg.question.mcqOptions.find((o) => o.id === optionId);
    const label = opt?.label || optionId;
    try {
      await answerQuestionApi(msg.question.id, { answerType: "mcq", mcqOptionId: optionId });
      msg.alreadyAnswered = true;
      msg.myAnswerMcqLabel = label;
      msg.question.answers = [...(msg.question.answers || []), {
        id: crypto.randomUUID(),
        respondentId: meId,
        respondentName: "Me",
        mcqOptionLabel: label,
      }];
      setConversationMessages([...conversationMessages]);
    } catch {
      toast.error("Failed to answer");
    }
  };

  const answerDetailed = async (msg) => {
    const text = detailedAnswers[msg.id]?.trim();
    if (!text) return;
    try {
      await answerQuestionApi(msg.question.id, { answerType: "detailed", detailedText: text });
      msg.alreadyAnswered = true;
      msg.myAnswerDetailed = text;
      setDetailedAnswers((prev) => ({ ...prev, [msg.id]: "" }));
      msg.question.answers = [...(msg.question.answers || []), {
        id: crypto.randomUUID(),
        respondentId: meId,
        respondentName: "Me",
        detailedText: text,
      }];
      setConversationMessages([...conversationMessages]);
    } catch {
      toast.error("Failed to answer");
    }
  };

  // Load all users for new conversation
  const handleLoadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  // Load my team
  const handleLoadMyTeam = async () => {
    try {
      const res = await getMyTeam();
      setMyTeam(res.data || []);
      const newSet = new Set(selectedRecipients);
      res.data.forEach(u => newSet.add(u.id));
      setSelectedRecipients(newSet);
    } catch {
      toast.error("Failed to load team");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e5ddd5]">
      <Toaster />

      {/* Left Pane */}
      <aside className="w-1/3 border-r border-gray-300 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Chats</h2>
          <button
            onClick={() => {
              setShowNewConvModal(true);
              handleLoadUsers();
              setSelectedRecipients(new Set());
              setNewConvType("direct");
              setNewConvTitle("");
              setRecipientMode("users");
            }}
            className="bg-green-500 text-white px-3 py-1 rounded-full"
          >
            +
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => filterConversations(e.target.value)}
          placeholder="Search..."
          className="m-2 p-2 rounded border focus:outline-none"
        />

        <div className="flex-1 overflow-y-auto">
          {filteredMessageList.map((conv) => (
            <div
              key={conv.conversationId}
              onClick={() => openConversation(conv)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedConversation?.conversationId === conv.conversationId ? "bg-gray-200" : ""}`}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                {conv.title?.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{conv.title || conv.kind}</span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-green-500 text-white px-2 rounded-full text-xs">{conv.unreadCount}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessageBody}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Pane */}
      <section className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <header className="flex items-center justify-between p-4 border-b bg-white">
              <div>
                <h3 className="font-semibold">{selectedConversation.title}</h3>
                <small className="text-gray-500">
                  {selectedConversation.participants
                    ?.filter((p) => p.id !== meId)
                    .map((p) => p.fullName)
                    .join(", ")}
                </small>
              </div>
              <button onClick={() => openConversation(selectedConversation)}>↻</button>
            </header>

            <div ref={scrollViewport} className="flex-1 p-4 overflow-y-auto space-y-3">
              {conversationMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderId === meId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-xl shadow ${m.senderId === meId ? "bg-[#dcf8c6]" : "bg-white"}`}>
                    {m.parentMessageId && (
                      <div className="border-l-2 border-gray-400 pl-2 mb-1 text-gray-500 text-sm">
                        Replying to: {conversationMessages.find(msg => msg.id === m.parentMessageId)?.body.slice(0, 50)}...
                      </div>
                    )}

                    {m.senderId !== meId && <div className="text-xs text-gray-400 mb-1">{m.senderName}</div>}
                    <div className="text-sm">{m.body}</div>

                    {m.question && (
                      <div className="mt-2 pl-2 border-l-2 border-indigo-400">
                        {m.question.questionType === "yes_no" && !m.alreadyAnswered && m.senderId !== meId && (
                          <div className="flex gap-2 mt-1">
                            <button onClick={() => answerYesNo(m, true)} className="bg-green-500 text-white px-2 py-1 rounded">Yes</button>
                            <button onClick={() => answerYesNo(m, false)} className="bg-red-500 text-white px-2 py-1 rounded">No</button>
                          </div>
                        )}
                        {m.alreadyAnswered && (
                          <em className="text-gray-700 text-sm">
                            Your answer: {m.myAnswerYesNo ? "Yes" : m.myAnswerMcqLabel || m.myAnswerDetailed || "Answered"}
                          </em>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 text-right mt-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="text-right mt-1">
                      <button onClick={() => setReplyTo(m)} className="text-indigo-500 text-xs underline">Reply</button>
                    </div>

                    {m.replies?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.replies.map((r) => (
                          <div key={r.id} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-300">
                            <strong>{r.senderName}</strong>: {r.body}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-3 border-t bg-white">
              {replyTo && (
                <div className="bg-gray-200 p-2 rounded mb-2 flex justify-between items-center">
                  Replying to <b>{replyTo.senderName}</b>: {replyTo.body.slice(0, 40)}...
                  <button onClick={() => setReplyTo(null)}>×</button>
                </div>
              )}
              <div className="flex gap-2">
                <select
                  value={composer.type}
                  onChange={(e) => setComposer({ ...composer, type: e.target.value })}
                  className="border rounded px-2 py-1"
                >
                  <option value="normal">Normal</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="mcq">MCQ</option>
                  <option value="detailed">Detailed</option>
                </select>
                <input
                  type="text"
                  value={composer.text}
                  onChange={(e) => setComposer({ ...composer, text: e.target.value })}
                  onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message"
                  className="flex-1 border rounded px-2 py-1"
                />
                <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-1 rounded-full">Send</button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </section>
    </div>
  );
}
