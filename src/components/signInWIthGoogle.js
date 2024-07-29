import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import 'firebase/firestore';
import { setDoc, doc, collection, addDoc } from "firebase/firestore";

function SignInwithGoogle({ fname, lname }) {
  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(db, "Users", user.uid);

        // Check if firstName and lastName are provided
        //const firstName = fname || "DefaultFirstName";
        //const lastName = lname || "DefaultLastName";

        try {
          await setDoc(userDocRef, {
            email: user.email,
            firstName: user.displayName,
            lastName: user.lastName,
            photo: "",
            mensagensRest: 50,
            redacoesRest: 2,
            lastMessageDate: currentDate.toISOString()
          });
        } catch (error) {
          console.error("Error setting user document:", error);
          toast.error("Failed to save user data", {
            position: "top-center",
          });
          return;
        }

        const enemDataRef = collection(userDocRef, "EnemData");
        try {
          await addDoc(enemDataRef, {
            espanhol: { acertos: 0, erros: 0 },
            Ingles: { acertos: 0, erros: 0 },
            ling: { acertos: 0, erros: 0 },
            matematica: { acertos: 0, erros: 0 },
            cienciasHumanas: { acertos: 0, erros: 0 },
            cienciasDaNatureza: { acertos: 0, erros: 0 },
            redacao: { notaTotal: 0, redacoesFeitas: 0 },
          });
        } catch (error) {
          console.error("Error adding EnemData document:", error);
          toast.error("Failed to save Enem data", {
            position: "top-center",
          });
          return;
        }

        toast.success("User logged in successfully", {
          position: "top-center",
        });
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("Error during sign in with Google:", error);
      toast.error("Failed to log in with Google", {
        position: "top-center",
      });
    }
  }

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../google.png")} width={"60%"} alt="Google login" />
      </div>
    </div>
  );
}

export default SignInwithGoogle;
