import Layout from '../components/Layout'

const Home = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="px-6 py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent leading-tight">
            DiagnoVision
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold">
            Early diagnosis of Diabetic Retinopathy and Glaucoma with AI
          </h1>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">Multi-disease support</p>
            <p className="text-slate-400 mt-2">Single platform for DR and Glaucoma—no context switching.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">Explainable results</p>
            <p className="text-slate-400 mt-2">Visual heatmaps and concise summaries for transparent decisions.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">Doctor integration</p>
            <p className="text-slate-400 mt-2">Comments, guidance, and collaboration built in.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">Uploads & history</p>
            <p className="text-slate-400 mt-2">Patients upload images and track results over time.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">Email scheduling</p>
            <p className="text-slate-400 mt-2">Automatic appointment emails with attached reports.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-2xl font-bold">For clinics & telemedicine</p>
            <p className="text-slate-400 mt-2">Built for real-world workflows and remote care.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10">
          <p className="text-3xl font-semibold mb-6">How it works</p>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-emerald-300 font-semibold text-xl">1. Upload</p>
              <p className="text-slate-400 text-lg">Add retinal images securely.</p>
            </div>

            <div>
              <p className="text-emerald-300 font-semibold text-xl">2. Analyze</p>
              <p className="text-slate-400 text-lg">AI models assess DR & Glaucoma.</p>
            </div>

            <div>
              <p className="text-emerald-300 font-semibold text-xl">3. Explain</p>
              <p className="text-slate-400 text-lg">Heatmaps reveal insights clearly.</p>
            </div>

            <div>
              <p className="text-emerald-300 font-semibold text-xl">4. Act</p>
              <p className="text-slate-400 text-lg">Doctors comment, schedule follow-ups.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home

