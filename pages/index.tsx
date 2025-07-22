import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetch(`/api/photos?token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => setPhotos(data));
    }
  }, [session]);

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  if (!session) {
    return (
      <main>
        <h1>Добро пожаловать в ClearCloud</h1>
        <button onClick={() => signIn("google")}>Войти через Google</button>
        <button onClick={() => signIn("github")}>Войти через GitHub</button>
      </main>
    );
  }

  return (
    <main>
      <h2>Привет, {session.user?.name}</h2>
      <p>Email: {session.user?.email}</p>
      <button onClick={() => signOut()}>Выйти</button>

      <h3>Фото за последние 7 дней:</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
        }}
      >
        {photos.map((item: any) => (
          <img
            key={item.id}
            src={`${item.baseUrl}=w300-h300`}
            alt={item.filename}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        ))}
      </div>
    </main>
  );
}
