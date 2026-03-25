import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  doc,
  limit,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  FileText,
  Image,
} from 'lucide-react'

const formatTime = (ts) => {
  if (!ts?.toDate) return ''
  const d = ts.toDate()
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const isFromPatient = (data) =>
  data?.sent_by_patient === true || data?.sent_by_patient === 'true'

const formatRelative = (ts) => {
  if (!ts?.toDate) return ''
  const d = ts.toDate()
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString()
}

const DoctorMessages = () => {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const selectedConv = conversations.find((c) => c.patientId === selectedPatientId)

  useEffect(() => {
    if (!currentUser) return

    let cancelled = false
    const load = async () => {
      setLoadingList(true)
      setError('')
      try {
        const relQ = query(
          collection(db, 'patient_doctor'),
          where('doctorId', '==', currentUser.uid),
          where('status', '==', 'active')
        )
        const relSnap = await getDocs(relQ)
        const rows = []
        for (const d of relSnap.docs) {
          const data = d.data()
          const patientId = data.patientId
          if (!patientId) continue
          const patientSnap = await getDoc(doc(db, 'patient', patientId))
          const pd = patientSnap.exists() ? patientSnap.data() : {}
          rows.push({
            patientId,
            name: pd.name || 'Patient',
            condition: pd.condition || '',
          })
        }

        const msgQ = query(
          collection(db, 'messages'),
          where('doctorId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(200)
        )
        const msgSnap = await getDocs(msgQ)
        const lastByPatient = {}
        msgSnap.docs.forEach((m) => {
          const x = m.data()
          const pid = x.patientId
          if (pid && !lastByPatient[pid]) {
            lastByPatient[pid] = {
              text: x.msg || '',
              createdAt: x.createdAt,
            }
          }
        })

        if (!cancelled) {
          setConversations(
            rows.map((r) => ({
              ...r,
              lastMessage: lastByPatient[r.patientId]?.text || '',
              lastAt: lastByPatient[r.patientId]?.createdAt || null,
            }))
          )
          if (rows.length && !selectedPatientId) {
            setSelectedPatientId(rows[0].patientId)
          }
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('Could not load conversations. Check Firestore indexes for messages.')
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [currentUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!currentUser || !selectedPatientId) {
      setMessages([])
      return
    }

    setLoadingThread(true)
    const q = query(
      collection(db, 'messages'),
      where('patientId', '==', selectedPatientId),
      where('doctorId', '==', currentUser.uid),
      orderBy('createdAt', 'asc')
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(
          snap.docs.map((d) => {
            const data = d.data()
            const fromPatient = isFromPatient(data)
            return {
              id: d.id,
              text: data.msg || '',
              isMine: !fromPatient,
              createdAt: data.createdAt,
            }
          })
        )
        setLoadingThread(false)
      },
      (err) => {
        console.error(err)
        setError('Could not load messages. You may need a Firestore composite index on messages.')
        setLoadingThread(false)
      }
    )

    return () => unsub()
  }, [currentUser, selectedPatientId])

  const handleSend = async () => {
    const text = newMessage.trim()
    if (!text || !currentUser || !selectedPatientId) return

    setNewMessage('')
    try {
      await addDoc(collection(db, 'messages'), {
        patientId: selectedPatientId,
        doctorId: currentUser.uid,
        msg: text,
        sent_by_patient: false,
        createdAt: serverTimestamp(),
      })
    } catch (e) {
      console.error(e)
      setNewMessage(text)
      setError('Failed to send message.')
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-0 w-full h-[calc(100dvh-7rem)] max-[1010px]:h-[calc(100dvh-5.5rem)] min-[1010px]:h-[calc(100dvh-11rem)]"
      >
        <div className="flex items-center gap-4 mb-3 sm:mb-6 shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-dark-400">Chat with your connected patients</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 glass-card p-3 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 glass-card overflow-hidden flex flex-col md:flex-row min-h-0">
          <div className="w-full md:w-80 border-r-0 md:border-r border-white/5 border-b md:border-b-0 flex flex-col max-h-[28vh] max-[1010px]:max-h-[26vh] md:max-h-none shrink-0">
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingList ? (
                <p className="p-4 text-sm text-dark-400">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-sm text-dark-400">
                  No patients yet. Patients appear after they connect and you accept.
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.patientId}
                    onClick={() => setSelectedPatientId(conv.patientId)}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      selectedPatientId === conv.patientId
                        ? 'bg-primary-500/10 border-l-2 border-primary-500'
                        : 'hover:bg-dark-800/50 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {conv.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white truncate">{conv.name}</h4>
                          {conv.lastAt && (
                            <span className="text-xs text-dark-500">{formatRelative(conv.lastAt)}</span>
                          )}
                        </div>
                        {conv.condition ? (
                          <p className="text-xs text-primary-400 mb-1">{conv.condition}</p>
                        ) : null}
                        <p className="text-sm text-dark-400 truncate">{conv.lastMessage || '—'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 min-h-0 basis-0 max-[1010px]:min-h-[min(52vh,28rem)]">
            {!selectedPatientId || !selectedConv ? (
              <div className="flex-1 flex items-center justify-center p-8 text-dark-400 text-sm">
                Select a conversation
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {selectedConv.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{selectedConv.name}</h4>
                      {selectedConv.condition ? (
                        <p className="text-xs text-primary-400">{selectedConv.condition}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors"
                      title="View Patient File"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0">
                  {loadingThread && messages.length === 0 ? (
                    <p className="text-sm text-dark-400">Loading messages...</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex w-full ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[min(85%,28rem)] p-4 rounded-2xl ${
                            msg.isMine
                              ? 'bg-primary-500 text-white rounded-br-sm'
                              : 'bg-dark-800/80 text-white rounded-bl-sm border border-white/5'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              msg.isMine ? 'text-primary-200' : 'text-dark-500'
                            }`}
                          >
                            <span className="text-xs">{formatTime(msg.createdAt)}</span>
                            {msg.isMine && <CheckCheck className="w-3 h-3 shrink-0" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <button type="button" className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                      <Image className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      className="p-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default DoctorMessages
