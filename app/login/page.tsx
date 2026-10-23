import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <div className="login-deco" aria-hidden>
        <span style={{ top: "12%", left: "10%" }}>🌸</span>
        <span style={{ top: "22%", right: "12%" }}>💋</span>
        <span style={{ bottom: "18%", left: "14%" }}>🎀</span>
        <span style={{ bottom: "10%", right: "16%" }}>✨</span>
        <span style={{ top: "55%", left: "4%" }}>💐</span>
        <span style={{ top: "62%", right: "5%" }}>🍓</span>
      </div>
      <section className="login-card">
        <p className="eyebrow">welcome to</p>
        <h1 className="display">
          Chaitanya&rsquo;s <em>Girlies</em>
        </h1>
        <p className="hand login-sub">Only the girlies may enter 💅</p>
        <LoginForm />
        <p className="tiny muted">A little universe, made with love ♡</p>
      </section>
    </main>
  );
}
