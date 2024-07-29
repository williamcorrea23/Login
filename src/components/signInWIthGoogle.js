import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";

function SignInwithGoogle() {
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (result.user) {
         await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo:"",
          mensagensRest: 50,
          redacoesRest: 2
        });

const enemDataRef = collection(userDocRef, "EnemData");
      await addDoc(enemDataRef, {
        espanhol: {
          acertos: 0,
          erros: 0
        },
          Ingles: {
          acertos: 0,
          erros: 0
        },
        ling: {
          acertos: 0,
          erros: 0
        },
        matematica: {
          acertos: 0,
          erros: 0
        },
        cienciasHumanas: {
          acertos: 0,
          erros: 0
        },
        cienciasDaNatureza: {
          acertos: 0,
          erros: 0
        },
        redacao: {
          notaTotal: 0,
          redacoesFeitas: 0
        }

        
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        window.location.href = "/profile";
      }
    });
  }
  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../google.png")} width={"60%"} />
      </div>
    </div>
  );
}
export default SignInwithGoogle;
