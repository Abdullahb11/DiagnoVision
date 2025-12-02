import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { 
  MessageSquare, Search, Send, Paperclip, 
  Phone, Video, MoreVertical, Check, CheckCheck,
  FileText, Image
} from 'lucide-react'

const DoctorMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(0)
  const [newMessage, setNewMessage] = useState('')

  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Thank you for the feedback, Doctor.',
      time: '5 min ago',
      unread: 3,
      online: true,
      condition: 'Mild NPDR'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'When should I schedule my next scan?',
      time: '30 min ago',
      unread: 1,
      online: true,
      condition: 'Normal'
    },
    {
      id: 3,
      name: 'Michael Brown',
      lastMessage: 'I have some concerns about the results.',
      time: '2 hours ago',
      unread: 0,
      online: false,
      condition: 'Moderate Glaucoma'
    },
    {
      id: 4,
      name: 'Emily Davis',
      lastMessage: 'Thank you for reviewing my scan.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      condition: 'Normal'
    },
  ]

  const messages = [
    {
      id: 1,
      sender: 'patient',
      text: 'Hello Doctor, I just received my scan results.',
      time: '10:00 AM',
      read: true
    },
    {
      id: 2,
      sender: 'doctor',
      text: 'Hello John, I reviewed your results. The scan shows mild signs of non-proliferative diabetic retinopathy.',
      time: '10:15 AM',
      read: true
    },
    {
      id: 3,
      sender: 'doctor',
      text: 'I recommend we schedule a follow-up in 3 months. In the meantime, continue monitoring your blood sugar levels.',
      time: '10:16 AM',
      read: true
    },
    {
      id: 4,
      sender: 'patient',
      text: 'Thank you for the feedback, Doctor.',
      time: '10:20 AM',
      read: false
    },
  ]

  const handleSend = () => {
    if (newMessage.trim()) {
      setNewMessage('')
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-[calc(100vh-200px)] flex flex-col"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-dark-400">Communicate with your patients</p>
          </div>
        </div>

        <div className="flex-1 glass-card overflow-hidden flex">
          <div className="w-80 border-r border-white/5 flex flex-col">
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
              {conversations.map((conv, index) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(index)}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedConversation === index
                      ? 'bg-primary-500/10 border-l-2 border-primary-500'
                      : 'hover:bg-dark-800/50 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 rounded-full border-2 border-dark-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white truncate">{conv.name}</h4>
                        <span className="text-xs text-dark-500">{conv.time}</span>
                      </div>
                      <p className="text-xs text-primary-400 mb-1">{conv.condition}</p>
                      <p className="text-sm text-dark-400 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JS</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-dark-900" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{conversations[selectedConversation]?.name}</h4>
                  <p className="text-xs text-primary-400">{conversations[selectedConversation]?.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors" title="View Patient File">
                  <FileText className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.sender === 'doctor'
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-dark-800/80 text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.sender === 'doctor' ? 'text-primary-200' : 'text-dark-500'
                    }`}>
                      <span className="text-xs">{msg.time}</span>
                      {msg.sender === 'doctor' && (
                        msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                />
                <button
                  onClick={handleSend}
                  className="p-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default DoctorMessages
