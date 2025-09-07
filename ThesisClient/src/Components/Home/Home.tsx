import { useAuth } from "../../Auth/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <h1>
      {user ? (
        <p>
          Id: {user.id} <br />
          Email: {user.email} <br />
          Name: {user.name} <br />
          Role: {user.role} <br />
          Token: {user.token} <br />
        </p>
      ) : (
        "No user"
      )}
    </h1>
  );
}
