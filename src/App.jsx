import { useState, useEffect, useCallback } from "react";

const PHASES = [
  { id: "identity", label: "Bản sắc Quốc gia", icon: "🏛️" },
  { id: "structure", label: "Cấu trúc Nhà nước", icon: "🏗️" },
  { id: "government", label: "Chính thể", icon: "⚖️" },
  { id: "executive", label: "Hành pháp", icon: "📋" },
  { id: "legislature", label: "Lập pháp", icon: "🗳️" },
  { id: "central_local", label: "Trung ương - Địa phương", icon: "🗺️" },
  { id: "review", label: "Tổng kết & Đánh giá", icon: "📊" },
];

const SCENARIOS = [
  {
    id: "economic_crisis",
    title: "Khủng hoảng Kinh tế",
    icon: "📉",
    description: "GDP sụt giảm 15%, tỷ lệ thất nghiệp tăng lên 25%. Người dân biểu tình đòi cải cách.",
    questions: [
      "Cơ quan nào có thẩm quyền quyết định gói kích cầu kinh tế?",
      "Quy trình thông qua ngân sách khẩn cấp diễn ra như thế nào?",
      "Chính quyền địa phương có vai trò gì trong phân phối cứu trợ?",
    ],
  },
  {
    id: "natural_disaster",
    title: "Thiên tai nghiêm trọng",
    icon: "🌊",
    description: "Siêu bão tàn phá 3 vùng, hàng triệu người mất nhà cửa. Cần huy động nguồn lực toàn quốc.",
    questions: [
      "Ai có quyền ban bố tình trạng khẩn cấp?",
      "Cơ chế phối hợp giữa trung ương và địa phương hoạt động ra sao?",
      "Nghị viện/Quốc hội kiểm soát chi tiêu khẩn cấp bằng cách nào?",
    ],
  },
  {
    id: "separatism",
    title: "Phong trào ly khai",
    icon: "🏴",
    description: "Một vùng giàu tài nguyên đòi tách ra thành quốc gia độc lập, tổ chức trưng cầu dân ý.",
    questions: [
      "Hiến pháp quốc gia bạn có cho phép ly khai không?",
      "Mô hình phân quyền có ngăn được phong trào ly khai không?",
      "Tòa án hiến pháp xử lý tình huống này thế nào?",
    ],
  },
  {
    id: "digital_transform",
    title: "Chuyển đổi số Quốc gia",
    icon: "💻",
    description: "Chính phủ triển khai chương trình chính phủ điện tử toàn diện, nhưng vấp phải kháng cự từ bộ máy quan liêu.",
    questions: [
      "Cơ quan nào chịu trách nhiệm chính trong triển khai chính phủ điện tử?",
      "Làm thế nào để đảm bảo sự phối hợp giữa các cấp chính quyền?",
      "Cơ chế giám sát nào đảm bảo minh bạch trong quá trình số hóa?",
    ],
  },
];

const OPTIONS = {
  structure: [
    {
      id: "unitary",
      label: "Nhà nước đơn nhất",
      desc: "Một hệ thống pháp luật thống nhất, quyền lực tập trung từ trung ương",
      examples: "Pháp, Nhật Bản, Việt Nam, Hàn Quốc",
      pros: "Thống nhất pháp luật, hiệu quả điều phối",
      cons: "Ít linh hoạt cho đặc thù địa phương",
    },
    {
      id: "federal",
      label: "Nhà nước liên bang",
      desc: "Các tiểu bang/vùng có quyền tự trị nhất định, có hiến pháp riêng",
      examples: "Hoa Kỳ, Đức, Brazil, Ấn Độ",
      pros: "Linh hoạt, phù hợp đa dạng",
      cons: "Phức tạp, có thể xung đột pháp lý",
    },
    {
      id: "confederation",
      label: "Nhà nước liên minh",
      desc: "Các quốc gia thành viên giữ chủ quyền cao, liên kết lỏng",
      examples: "EU (một phần), Thụy Sĩ (lịch sử)",
      pros: "Tôn trọng chủ quyền thành viên",
      cons: "Khó ra quyết định chung, thiếu ràng buộc",
    },
  ],
  government: [
    {
      id: "presidential",
      label: "Cộng hòa Tổng thống",
      desc: "Tổng thống vừa là nguyên thủ quốc gia vừa đứng đầu hành pháp. Tam quyền phân lập triệt để.",
      examples: "Hoa Kỳ, Brazil, Hàn Quốc, Indonesia",
      pros: "Hành pháp mạnh, ổn định nhiệm kỳ",
      cons: "Nguy cơ lạm quyền, bế tắc giữa lập pháp và hành pháp",
    },
    {
      id: "parliamentary",
      label: "Cộng hòa Đại nghị",
      desc: "Nghị viện nắm quyền lực tối cao. Thủ tướng đứng đầu hành pháp, chịu trách nhiệm trước Nghị viện.",
      examples: "Đức, Italia, Singapore, Ấn Độ",
      pros: "Dân chủ, ít nguy cơ độc tài",
      cons: "Hành pháp có thể yếu, chính phủ liên minh bất ổn",
    },
    {
      id: "semi_presidential",
      label: "Cộng hòa Lưỡng tính",
      desc: "Hành pháp hai đầu: Tổng thống và Thủ tướng cùng chia sẻ quyền lực hành pháp.",
      examples: "Pháp, Phần Lan, Bồ Đào Nha",
      pros: "Cân bằng quyền lực, hạn chế độc tài",
      cons: "Xung đột giữa TT và TTg khi khác đảng (cohabitation)",
    },
    {
      id: "socialist",
      label: "Cộng hòa XHCN",
      desc: "Đảng lãnh đạo toàn diện, quyền lực thống nhất, không tam quyền phân lập.",
      examples: "Việt Nam, Trung Quốc, Cuba",
      pros: "Ổn định chính trị, tập trung nguồn lực",
      cons: "Hạn chế đa nguyên chính trị",
    },
  ],
  executive: [
    {
      id: "strong_president",
      label: "Tổng thống mạnh",
      desc: "Tổng thống nắm toàn quyền hành pháp, bổ nhiệm nội các, không cần tín nhiệm của nghị viện",
    },
    {
      id: "pm_led",
      label: "Thủ tướng điều hành",
      desc: "Thủ tướng là người đứng đầu hành pháp thực quyền, nguyên thủ quốc gia mang tính biểu tượng",
    },
    {
      id: "dual_executive",
      label: "Hành pháp hai đầu",
      desc: "Tổng thống hoạch định chính sách, Thủ tướng tổ chức thực thi, chia sẻ quyền lực",
    },
    {
      id: "collective",
      label: "Hành pháp tập thể",
      desc: "Chính phủ hoạt động theo nguyên tắc tập thể lãnh đạo, cá nhân phụ trách",
    },
  ],
  legislature: [
    {
      id: "unicameral",
      label: "Đơn viện",
      desc: "Một viện duy nhất, quy trình lập pháp nhanh gọn",
      examples: "Việt Nam, Hàn Quốc, Singapore",
    },
    {
      id: "bicameral",
      label: "Lưỡng viện",
      desc: "Thượng viện + Hạ viện, kiểm soát chéo trong lập pháp",
      examples: "Hoa Kỳ, Đức, Nhật Bản, Pháp",
    },
  ],
  central_local: [
    {
      id: "centralized",
      label: "Tập quyền",
      desc: "Trung ương quyết định hầu hết, địa phương thực thi theo chỉ đạo",
    },
    {
      id: "decentralized",
      label: "Phân quyền",
      desc: "Địa phương có quyền tự chủ cao về ngân sách, nhân sự, chính sách",
    },
    {
      id: "deconcentrated",
      label: "Tản quyền",
      desc: "Trung ương đặt cơ quan đại diện tại địa phương để thực thi",
    },
    {
      id: "mixed",
      label: "Kết hợp",
      desc: "Kết hợp linh hoạt giữa tập quyền và phân quyền theo lĩnh vực",
    },
  ],
};

const SCORING = {
  consistency: {
    label: "Tính nhất quán",
    max: 25,
    desc: "Các lựa chọn có logic, phù hợp với nhau",
  },
  justification: {
    label: "Lập luận",
    max: 25,
    desc: "Giải thích hợp lý, có cơ sở lý thuyết",
  },
  scenario: {
    label: "Xử lý tình huống",
    max: 25,
    desc: "Vận dụng mô hình để giải quyết vấn đề thực tế",
  },
  creativity: {
    label: "Sáng tạo & Phản biện",
    max: 25,
    desc: "Nhận diện ưu/nhược điểm, đề xuất cải tiến",
  },
};

// Consistency check logic
function checkConsistency(choices) {
  const issues = [];
  const warnings = [];
  const good = [];

  if (choices.structure === "federal" && choices.central_local === "centralized") {
    issues.push("Nhà nước liên bang thường không đi với mô hình tập quyền hoàn toàn. Cần giải thích tại sao bạn chọn sự kết hợp này.");
  }
  if (choices.structure === "unitary" && choices.central_local === "decentralized") {
    warnings.push("Nhà nước đơn nhất với phân quyền mạnh là khả thi (VD: Nhật Bản) nhưng cần cơ chế giám sát rõ ràng.");
  }
  if (choices.government === "presidential" && choices.executive === "pm_led") {
    issues.push("Cộng hòa Tổng thống thường không có Thủ tướng điều hành. Hãy cân nhắc lại sự lựa chọn.");
  }
  if (choices.government === "parliamentary" && choices.executive === "strong_president") {
    issues.push("Cộng hòa Đại nghị không phù hợp với Tổng thống mạnh. Nguyên thủ quốc gia thường mang tính biểu tượng.");
  }
  if (choices.government === "semi_presidential" && choices.executive === "dual_executive") {
    good.push("Lựa chọn nhất quán! Cộng hòa lưỡng tính đi với hành pháp hai đầu là mô hình Pháp điển hình.");
  }
  if (choices.government === "parliamentary" && choices.executive === "pm_led") {
    good.push("Phù hợp! Mô hình đại nghị với Thủ tướng điều hành là sự kết hợp chuẩn mực.");
  }
  if (choices.government === "presidential" && choices.executive === "strong_president") {
    good.push("Nhất quán! Tổng thống mạnh trong mô hình cộng hòa tổng thống, giống Hoa Kỳ.");
  }
  if (choices.structure === "federal" && choices.legislature === "bicameral") {
    good.push("Hợp lý! Nhà nước liên bang thường có lưỡng viện để đại diện cho các bang/vùng.");
  }
  if (choices.structure === "federal" && choices.legislature === "unicameral") {
    warnings.push("Nhà nước liên bang hiếm khi chỉ có đơn viện. Thượng viện thường cần thiết để đại diện cho các đơn vị thành viên.");
  }

  return { issues, warnings, good };
}

function OptionCard({ option, selected, onSelect, compact }) {
  const isSelected = selected === option.id;
  return (
    <div
      onClick={() => onSelect(option.id)}
      style={{
        padding: compact ? "14px 16px" : "18px 20px",
        borderRadius: "12px",
        border: isSelected ? "2px solid #1a5276" : "2px solid #e0e0e0",
        background: isSelected
          ? "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)"
          : "#fff",
        color: isSelected ? "#fff" : "#333",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: isSelected ? "0 4px 16px rgba(26,82,118,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", fontFamily: "'Noto Serif', Georgia, serif" }}>
        {option.label}
      </div>
      <div style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5 }}>{option.desc}</div>
      {option.examples && (
        <div
          style={{
            fontSize: "12px",
            marginTop: "6px",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          VD: {option.examples}
        </div>
      )}
      {option.pros && isSelected && (
        <div style={{ marginTop: "8px", fontSize: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "4px" }}>
            ✓ {option.pros}
          </span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "4px" }}>
            ✗ {option.cons}
          </span>
        </div>
      )}
    </div>
  );
}

function PhaseContent({ phase, choices, setChoices, nationName, setNationName, justifications, setJustifications }) {
  const updateChoice = (key, value) => setChoices((prev) => ({ ...prev, [key]: value }));
  const updateJustification = (key, value) => setJustifications((prev) => ({ ...prev, [key]: value }));

  if (phase === "identity") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 8px", fontSize: "18px" }}>
            Đặt tên cho Quốc gia của bạn
          </h3>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 12px" }}>
            Hãy đặt một cái tên phản ánh bản sắc và tầm nhìn cho quốc gia mà bạn sắp thiết kế.
          </p>
          <input
            type="text"
            value={nationName}
            onChange={(e) => setNationName(e.target.value)}
            placeholder="Nhập tên quốc gia..."
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #d5dbdb",
              borderRadius: "10px",
              fontSize: "18px",
              fontFamily: "'Noto Serif', Georgia, serif",
              fontWeight: 600,
              color: "#1a5276",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2e86c1")}
            onBlur={(e) => (e.target.style.borderColor = "#d5dbdb")}
          />
        </div>
        <div style={{ background: "#fef9e7", borderRadius: "10px", padding: "16px", border: "1px solid #f9e79f" }}>
          <div style={{ fontWeight: 700, marginBottom: "6px", color: "#7d6608", fontSize: "14px" }}>💡 Gợi ý</div>
          <div style={{ fontSize: "13px", color: "#7d6608", lineHeight: 1.6 }}>
            Tên quốc gia thường phản ánh hình thức chính thể. Ví dụ: "Cộng hòa Liên bang X", "Vương quốc Y", "Nhà nước XHCN Z". Bạn có thể quay lại đổi tên sau khi đã chọn xong mô hình.
          </div>
        </div>
      </div>
    );
  }

  const optionKey = phase;
  const options = OPTIONS[optionKey];
  if (!options) return null;

  const phaseLabels = {
    structure: "Chọn cấu trúc nhà nước",
    government: "Chọn hình thức chính thể",
    executive: "Chọn mô hình hành pháp",
    legislature: "Chọn mô hình lập pháp",
    central_local: "Chọn quan hệ trung ương - địa phương",
  };

  const phaseDescriptions = {
    structure: "Cấu trúc nhà nước quyết định cách thức tổ chức lãnh thổ và phân chia quyền lực giữa các đơn vị hành chính.",
    government: "Hình thức chính thể xác định mối quan hệ giữa các nhánh quyền lực: lập pháp, hành pháp và tư pháp.",
    executive: "Mô hình hành pháp xác định ai nắm quyền điều hành và cách thức ra quyết định chính sách.",
    legislature: "Cơ cấu lập pháp ảnh hưởng đến quy trình làm luật và cơ chế đại diện của người dân.",
    central_local: "Mối quan hệ trung ương - địa phương quyết định mức độ tự chủ của các cấp chính quyền.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 6px", fontSize: "18px" }}>
          {phaseLabels[optionKey]}
        </h3>
        <p style={{ color: "#666", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>{phaseDescriptions[optionKey]}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            selected={choices[optionKey]}
            onSelect={(v) => updateChoice(optionKey, v)}
            compact={options.length > 3}
          />
        ))}
      </div>
      {choices[optionKey] && (
        <div style={{ marginTop: "4px" }}>
          <label style={{ fontWeight: 600, fontSize: "14px", color: "#1a5276", display: "block", marginBottom: "6px" }}>
            📝 Giải thích lựa chọn (bắt buộc cho đánh giá)
          </label>
          <textarea
            value={justifications[optionKey] || ""}
            onChange={(e) => updateJustification(optionKey, e.target.value)}
            placeholder="Tại sao bạn chọn mô hình này? Dựa trên lý thuyết hay kinh nghiệm quốc tế nào?"
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              border: "2px solid #d5dbdb",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              lineHeight: 1.5,
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2e86c1")}
            onBlur={(e) => (e.target.style.borderColor = "#d5dbdb")}
          />
        </div>
      )}
    </div>
  );
}

function ReviewPanel({ choices, nationName, justifications }) {
  const consistency = checkConsistency(choices);
  const allPhases = ["structure", "government", "executive", "legislature", "central_local"];
  const completed = allPhases.filter((p) => choices[p]).length;
  const hasJustifications = allPhases.filter((p) => justifications[p] && justifications[p].trim().length > 20).length;

  const getLabel = (key, id) => {
    const opt = OPTIONS[key]?.find((o) => o.id === id);
    return opt?.label || "Chưa chọn";
  };

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarioResponse, setScenarioResponse] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Nation Summary */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)",
          borderRadius: "14px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7, marginBottom: "4px" }}>
          Hồ sơ Quốc gia
        </div>
        <div style={{ fontSize: "26px", fontWeight: 700, fontFamily: "'Noto Serif', Georgia, serif", marginBottom: "16px" }}>
          {nationName || "Chưa đặt tên"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {allPhases.map((key) => (
            <div key={key} style={{ background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase" }}>
                {key === "structure" ? "Cấu trúc" : key === "government" ? "Chính thể" : key === "executive" ? "Hành pháp" : key === "legislature" ? "Lập pháp" : "TW-ĐP"}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px" }}>
                {choices[key] ? getLabel(key, choices[key]) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency Check */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>
          🔍 Kiểm tra tính nhất quán
        </h4>
        {consistency.good.map((g, i) => (
          <div key={i} style={{ background: "#e8f8f5", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#0e6251" }}>
            ✅ {g}
          </div>
        ))}
        {consistency.warnings.map((w, i) => (
          <div key={i} style={{ background: "#fef9e7", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#7d6608" }}>
            ⚠️ {w}
          </div>
        ))}
        {consistency.issues.map((issue, i) => (
          <div key={i} style={{ background: "#fdedec", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#922b21" }}>
            ❌ {issue}
          </div>
        ))}
        {consistency.good.length === 0 && consistency.warnings.length === 0 && consistency.issues.length === 0 && (
          <div style={{ fontSize: "13px", color: "#999" }}>Hãy hoàn thành các lựa chọn để xem kết quả kiểm tra.</div>
        )}
      </div>

      {/* Scoring */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>
          📊 Tiêu chí đánh giá (100 điểm)
        </h4>
        {Object.entries(SCORING).map(([key, s]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#333" }}>{s.label}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{s.desc}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#1a5276", minWidth: "50px", textAlign: "right" }}>
              /{s.max}
            </div>
          </div>
        ))}
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
          <strong>Tiến độ:</strong> {completed}/5 lựa chọn · {hasJustifications}/5 giải thích
        </div>
      </div>

      {/* Scenario Challenge */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>
          🎯 Thử thách tình huống
        </h4>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px" }}>
          Chọn một kịch bản để kiểm tra xem mô hình quốc gia của bạn vận hành thế nào trong thực tế.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id === selectedScenario ? null : sc.id)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: selectedScenario === sc.id ? "2px solid #1a5276" : "2px solid #e0e0e0",
                background: selectedScenario === sc.id ? "#eaf2f8" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{sc.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#333" }}>{sc.title}</div>
            </div>
          ))}
        </div>
        {selectedScenario && (
          <div style={{ marginTop: "14px", background: "#f8f9fa", borderRadius: "10px", padding: "16px" }}>
            {(() => {
              const sc = SCENARIOS.find((s) => s.id === selectedScenario);
              return (
                <>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px", color: "#1a5276" }}>
                    {sc.icon} {sc.title}
                  </div>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: "0 0 12px" }}>{sc.description}</p>
                  <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.6 }}>
                    <strong>Câu hỏi cần trả lời:</strong>
                    {sc.questions.map((q, i) => (
                      <div key={i} style={{ padding: "6px 0 6px 16px", borderLeft: "3px solid #2e86c1", marginTop: "8px", marginLeft: "4px" }}>
                        {i + 1}. {q}
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={scenarioResponse}
                    onChange={(e) => setScenarioResponse(e.target.value)}
                    placeholder="Phân tích cách mô hình quốc gia của bạn xử lý tình huống này..."
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "12px",
                      border: "2px solid #d5dbdb",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                      marginTop: "12px",
                      lineHeight: 1.5,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2e86c1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d5dbdb")}
                  />
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NationBuilderSimulation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [choices, setChoices] = useState({});
  const [nationName, setNationName] = useState("");
  const [justifications, setJustifications] = useState({});

  const phase = PHASES[currentPhase];
  const isReview = phase.id === "review";

  return (
    <div
      style={{
        fontFamily: "'Noto Sans', 'Segoe UI', system-ui, sans-serif",
        maxWidth: "780px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f4f6f7",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2e4a 0%, #1a5276 50%, #2e86c1 100%)",
          padding: "28px 24px 20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", opacity: 0.6, marginBottom: "6px" }}>
          So sánh Quản trị công · Trò chơi Mô phỏng
        </div>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>
          🏛️ NATION BUILDER
        </h1>
        <div style={{ fontSize: "13px", opacity: 0.75 }}>Thiết kế Quốc gia — Xây dựng Bộ máy Nhà nước</div>
      </div>

      {/* Phase Navigation */}
      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #e0e0e0", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "4px", minWidth: "fit-content" }}>
          {PHASES.map((p, i) => {
            const isActive = i === currentPhase;
            const isDone =
              i === 0
                ? nationName.trim().length > 0
                : i === 6
                  ? false
                  : !!choices[p.id];
            return (
              <div
                key={p.id}
                onClick={() => setCurrentPhase(i)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "#1a5276" : isDone ? "#e8f8f5" : "transparent",
                  color: isActive ? "#fff" : isDone ? "#0e6251" : "#888",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
                {isDone && !isActive && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px 16px 100px" }}>
        {isReview ? (
          <ReviewPanel choices={choices} nationName={nationName} justifications={justifications} />
        ) : (
          <PhaseContent
            phase={phase.id}
            choices={choices}
            setChoices={setChoices}
            nationName={nationName}
            setNationName={setNationName}
            justifications={justifications}
            setJustifications={setJustifications}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #d5dbdb",
            background: currentPhase === 0 ? "#f0f0f0" : "#fff",
            color: currentPhase === 0 ? "#bbb" : "#333",
            fontSize: "14px",
            fontWeight: 600,
            cursor: currentPhase === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Quay lại
        </button>
        <div style={{ fontSize: "13px", color: "#888" }}>
          {currentPhase + 1} / {PHASES.length}
        </div>
        <button
          onClick={() => setCurrentPhase(Math.min(PHASES.length - 1, currentPhase + 1))}
          disabled={currentPhase === PHASES.length - 1}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: currentPhase === PHASES.length - 1 ? "#d5dbdb" : "linear-gradient(135deg, #1a5276, #2e86c1)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: currentPhase === PHASES.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Tiếp theo →
        </button>
      </div>
    </div>
  );
}
