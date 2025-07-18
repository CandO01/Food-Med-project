import React from 'react';

const AboutUs = () => {
  return (
    <div className="p-6 md:p-12 pb-100 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <p className="mb-4 text-lg leading-relaxed">
        <strong>FoodMed</strong> is a people-first solution designed to bridge the gap between
        <strong> medical advice and basic human needs</strong> — food and health. In many underserved
        communities, patients not only struggle with access to proper healthcare but also face
        challenges in getting the right nutrition, especially when managing chronic conditions.
        FoodMed addresses this double-edged challenge by connecting <strong>verified medical professionals</strong> with
        users who need <strong>free medical advice</strong>, while also enabling those with food to share it with
        those in urgent need — a beautiful blend of <strong>healthcare support and humanitarian service</strong>.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        Through our secure, user-friendly platform, people can:
      </p>
      <ul className="list-disc pl-6 mb-6 text-lg space-y-2">
        <li>Request medical guidance from <strong>verified doctors</strong>, especially when hospitals are out of reach.</li>
        <li>Donate or request food supplies, ensuring no one in need is left behind.</li>
        <li>Engage in real-time chat with either donors or medical professionals to get timely help.</li>
      </ul>

      <p className="mb-6 text-lg leading-relaxed">
        FoodMed is more than just an app — it’s a <strong>lifeline</strong>, built on compassion, technology, and community impact.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
      <ul className="list-disc pl-6 mb-6 text-lg space-y-2">
        <li><strong>Matthew</strong> – Fullstack Developer & Vision Carrier</li>
        <li><strong>Boss Angel</strong> – Frontend Lead & System Integrator</li>
        <li><strong>Abiluv</strong> – Backend Engineer with an eye for structure</li>
        <li><strong>Destiny & Miracle</strong> – The brilliant UI/UX duo that shaped every experience</li>
        <li><strong>Daisy</strong> – Our amiable and energetic Product Manager, always pushing boundaries</li>
        <li><strong>Mr. Oreoluwa</strong> – The greatest facilitator, mentor, and guiding light</li>
        <li><strong>Techwitsclan Organization</strong> – Powering us with knowledge, structure, and purpose</li>
      </ul>

      <p className="text-lg leading-relaxed">
        At FoodMed, we believe <strong>technology should care</strong>, and our platform is here to
        <strong> serve humanity, one meal and one medical advice at a time.</strong>
      </p>

      <p className="mb-[100px] text-xl font-semibold text-center">
        Together, we’re not just building an app — we’re creating a movement.<br />
        <span className="text-primary">Join us. Heal with us. Feed with us.</span>
      </p>
    </div>
  );
};

export default AboutUs;
