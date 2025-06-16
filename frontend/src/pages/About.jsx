export function About() {
  return (
    <div className="about">
      <header>
        <h1>About Toilet Conflict</h1>
      </header>
      <main>
        <section>
          <p>
            Welcome to Toilet Conflict - the ultimate solution for tracking marital tensions arising from bathroom usage habits! This application was born from the age-old question: "Why are you always in the bathroom?"
          </p>
        </section>
        <section>
          <h2>How It Works</h2>
          <p>
            Our sophisticated tracking system monitors daily toilet usage and the resulting "complaints" based on frequency:
          </p>
          <ul>
            <li>3+ toilet uses per day = complaints begin</li>
            <li>Each additional use = one more complaint</li>
            <li>3 complaints = nuclear-level conflict ensues!</li>
          </ul>
        </section>
        <section>
          <h2>Technology</h2>
          <p>
            This application is built with tongue firmly in cheek, but with serious tech: React frontend and Express/MongoDB backend, featuring user authentication, state management, and data persistence.
          </p>
        </section>
        <footer>
          <p>
            May your bathroom visits be brief and your conflicts minimal!
          </p>
        </footer>
      </main>
    </div>
  )
}