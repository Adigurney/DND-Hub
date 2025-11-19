import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="centered-page"
    >
      <br/><br/><br/>
      <h1> 🧙‍♂️ Adventurer’s Board</h1>
      <img src="/tavern.jpg" alt="tavern" />
      <p> Choose a path from the tavern board on the left.</p>
    </motion.div>
  );
}
