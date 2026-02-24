export default function ModelsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">Our Three Learning Models</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 border rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">Self-Paced</h3>
            <p>Learn at your own speed with recorded videos & PDFs</p>
          </div>
          <div className="text-center p-8 border rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">One-on-One</h3>
            <p>Private sessions with dedicated expert tutors</p>
          </div>
          <div className="text-center p-8 border rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">Batch Training</h3>
            <p>Live group classes with schedules & interaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}