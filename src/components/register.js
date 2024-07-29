import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import 'firebase/firestore';
import { setDoc, doc, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const currentDate = new Date();
      console.log(user);
      if (user) 
      {
        const userDocRef = doc(db, "Users", user.uid);        
        await setDoc(userDocRef, {
          email: user.email,
          firstName: user.displayName,
          lastName: "",
          photo:"",
          mensagensRest: 50,
          redacoesRest: 2,
          lastMessageDate: currentDate.toISOString()
        });

const enemDataRef = collection(userDocRef, "EnemData");
      await addDoc(enemDataRef, {
            espanhol: { acertos: 0, erros: 0 },
            Ingles: { acertos: 0, erros: 0 },
            ling: { acertos: 0, erros: 0 },
            matematica: { acertos: 0, erros: 0 },
            cienciasHumanas: { acertos: 0, erros: 0 },
            cienciasDaNatureza: { acertos: 0, erros: 0 },
            redacao: { notaTotal: 0, redacoesFeitas: 0 },
      });
        
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/login">Login</a>
      </p>
    </form>
  );
}
export default Register;
