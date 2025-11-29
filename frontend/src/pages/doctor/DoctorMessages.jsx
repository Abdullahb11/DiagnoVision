import Layout from '../../components/Layout'

const DoctorMessages = () => {
  return (
    <Layout>
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-emerald-300 mb-8">Messages</h1>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-slate-400">Messages will be displayed here</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DoctorMessages

