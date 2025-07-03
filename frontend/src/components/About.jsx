import { Heart } from 'lucide-react';

function About() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488330890490-c291ecf62571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Turning Excess into Opportunity</h1>
          <p className="text-2xl">Reducing Waste, Feeding Communities</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600">
            We believe that every meal has value and no food should go to waste. Our platform bridges 
            the gap between excess food and those who need it, creating a sustainable solution that 
            benefits both businesses and communities.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-green-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-green-700 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Register Business", desc: "Sign up your restaurant or hotel" },
              { title: "List Excess Food", desc: "Post available food items" },
              { title: "We Connect", desc: "Match with NGOs or buyers" },
              { title: "Make Impact", desc: "Food reaches those in need" }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "50,000+", label: "Meals Saved" },
              { number: "200+", label: "Active Donors" },
              { number: "10,000+", label: "People Helped" }
            ].map((stat, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-8">
                <div className="text-4xl font-bold text-green-700 mb-2">{stat.number}</div>
                <div className="text-xl text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">Join our mission to reduce food waste and feed communities</p>
          <a 
            href="/donate"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
          >
            Start Donating Today
            <Heart className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;