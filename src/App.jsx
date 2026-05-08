export default function NationBuilderSimulation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [choices, setChoices] = useState({});
  const [nationName, setNationName] = useState("");
  const [justifications, setJustifications] = useState({});

  const phase = PHASES[currentPhase];
  const isReview = phase.id === "review";

  return (
    <div>
      {/* nội dung giao diện game của bạn */}
    </div>
  );
}
