import { useEffect, useMemo, useState } from "react";

const PHASES = [
  { id: "identity", label: "Bản sắc Quốc gia", icon: "🏛️" },
  { id: "structure", label: "Cấu trúc Nhà nước", icon: "🏗️" },
  { id: "government", label: "Chính thể", icon: "⚖️" },
  { id: "executive", label: "Hành pháp", icon: "📋" },
  { id: "legislature", label: "Lập pháp", icon: "🗳️" },
  { id: "central_local", label: "Trung ương - Địa phương", icon: "🗺️" },
  { id: "review", label: "Tổng kết & Đánh giá", icon: "📊" },
];

const DESIGN_PHASES = ["structure", "government", "executive", "legislature", "central_local"];

const INDICATORS = {
  coordination: {
    label: "Điều phối TW",
    fullLabel: "Năng lực điều phối trung ương",
    desc: "Khả năng thống nhất chính sách, huy động nguồn lực và chỉ đạo toàn quốc.",
  },
  localAutonomy: {
    label: "Tự chủ ĐP",
    fullLabel: "Tự chủ địa phương",
    desc: "Mức độ địa phương có quyền quyết định ngân sách, nhân sự và chính sách phù hợp bối cảnh.",
  },
  accountability: {
    label: "Giải trình",
    fullLabel: "Trách nhiệm giải trình",
    desc: "Mức độ quyền lực được kiểm soát, minh bạch và chịu trách nhiệm trước người dân/cơ quan đại diện.",
  },
  efficiency: {
    label: "Hiệu quả",
    fullLabel: "Hiệu quả hành chính",
    desc: "Tốc độ và chi phí ra quyết định, triển khai chính sách và cung cấp dịch vụ công.",
  },
  equity: {
    label: "Công bằng",
    fullLabel: "Công bằng dịch vụ công",
    desc: "Khả năng bảo đảm tiêu chuẩn dịch vụ công tương đối đồng đều giữa các vùng.",
  },
  stability: {
    label: "Ổn định",
    fullLabel: "Ổn định chính trị - thể chế",
    desc: "Khả năng duy trì trật tự, giảm đứt gãy chính sách và hạn chế khủng hoảng chính trị.",
  },
  innovation: {
    label: "Đổi mới",
    fullLabel: "Đổi mới chính sách",
    desc: "Khả năng thử nghiệm chính sách, thích ứng với thay đổi và học hỏi từ địa phương/quốc tế.",
  },
  crisisCapacity: {
    label: "Khủng hoảng",
    fullLabel: "Năng lực ứng phó khủng hoảng",
    desc: "Khả năng ra quyết định nhanh, phối hợp đa cấp và phân bổ nguồn lực khi có biến cố.",
  },
};

const BASE_INDICATORS = Object.keys(INDICATORS).reduce((acc, key) => ({ ...acc, [key]: 50 }), {});

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
      desc: "Một hệ thống pháp luật thống nhất, quyền lực tập trung từ trung ương.",
      examples: "Pháp, Nhật Bản, Việt Nam, Hàn Quốc",
      pros: "Thống nhất pháp luật, hiệu quả điều phối",
      cons: "Ít linh hoạt cho đặc thù địa phương",
      effects: { coordination: 12, equity: 8, efficiency: 4, localAutonomy: -10, innovation: -4 },
    },
    {
      id: "federal",
      label: "Nhà nước liên bang",
      desc: "Các tiểu bang/vùng có quyền tự trị nhất định, có hiến pháp hoặc thẩm quyền riêng.",
      examples: "Hoa Kỳ, Đức, Brazil, Ấn Độ",
      pros: "Linh hoạt, phù hợp đa dạng lãnh thổ",
      cons: "Phức tạp, có thể xung đột pháp lý",
      effects: { localAutonomy: 15, innovation: 9, accountability: 5, coordination: -8, equity: -4 },
    },
    {
      id: "confederation",
      label: "Nhà nước liên minh",
      desc: "Các quốc gia/thành viên giữ chủ quyền cao, liên kết lỏng để phối hợp một số lĩnh vực.",
      examples: "EU (một phần), Thụy Sĩ (lịch sử)",
      pros: "Tôn trọng chủ quyền thành viên",
      cons: "Khó ra quyết định chung, thiếu ràng buộc",
      effects: { localAutonomy: 20, innovation: 6, coordination: -18, crisisCapacity: -12, stability: -6 },
    },
  ],
  government: [
    {
      id: "presidential",
      label: "Cộng hòa Tổng thống",
      desc: "Tổng thống vừa là nguyên thủ quốc gia vừa đứng đầu hành pháp. Tam quyền phân lập rõ.",
      examples: "Hoa Kỳ, Brazil, Hàn Quốc, Indonesia",
      pros: "Hành pháp mạnh, ổn định nhiệm kỳ",
      cons: "Nguy cơ lạm quyền hoặc bế tắc lập pháp - hành pháp",
      effects: { crisisCapacity: 10, stability: 6, efficiency: 5, accountability: -4, coordination: 4 },
    },
    {
      id: "parliamentary",
      label: "Cộng hòa Đại nghị",
      desc: "Nghị viện giữ vai trò trung tâm. Thủ tướng đứng đầu hành pháp và chịu trách nhiệm trước Nghị viện.",
      examples: "Đức, Italia, Singapore, Ấn Độ",
      pros: "Dễ kiểm soát chính phủ, ít nguy cơ độc tài",
      cons: "Hành pháp có thể yếu nếu chính phủ liên minh bất ổn",
      effects: { accountability: 12, equity: 4, innovation: 3, crisisCapacity: -5, stability: -2 },
    },
    {
      id: "semi_presidential",
      label: "Cộng hòa Lưỡng tính",
      desc: "Hành pháp hai đầu: Tổng thống và Thủ tướng cùng chia sẻ quyền lực hành pháp.",
      examples: "Pháp, Phần Lan, Bồ Đào Nha",
      pros: "Cân bằng quyền lực và vẫn giữ hành pháp tương đối mạnh",
      cons: "Có thể xung đột khi Tổng thống và đa số nghị viện khác phe",
      effects: { crisisCapacity: 6, accountability: 5, stability: 2, efficiency: -2 },
    },
    {
      id: "socialist",
      label: "Cộng hòa XHCN",
      desc: "Đảng lãnh đạo toàn diện, quyền lực nhà nước thống nhất, không tổ chức theo tam quyền phân lập.",
      examples: "Việt Nam, Trung Quốc, Cuba",
      pros: "Ổn định chính trị, tập trung nguồn lực",
      cons: "Hạn chế đa nguyên và phụ thuộc nhiều vào cơ chế kiểm soát nội bộ",
      effects: { stability: 12, coordination: 10, crisisCapacity: 6, accountability: -8, localAutonomy: -5 },
    },
  ],
  executive: [
    {
      id: "strong_president",
      label: "Tổng thống mạnh",
      desc: "Tổng thống nắm quyền hành pháp, bổ nhiệm nội các, không cần tín nhiệm thường xuyên của nghị viện.",
      effects: { efficiency: 10, crisisCapacity: 10, coordination: 5, accountability: -6 },
    },
    {
      id: "pm_led",
      label: "Thủ tướng điều hành",
      desc: "Thủ tướng là người đứng đầu hành pháp thực quyền; nguyên thủ quốc gia chủ yếu mang tính biểu tượng.",
      effects: { accountability: 8, efficiency: 4, stability: 3, crisisCapacity: -3 },
    },
    {
      id: "dual_executive",
      label: "Hành pháp hai đầu",
      desc: "Tổng thống hoạch định chính sách, Thủ tướng tổ chức thực thi và chịu trách nhiệm trước nghị viện.",
      effects: { accountability: 5, crisisCapacity: 4, coordination: -2, efficiency: -3 },
    },
    {
      id: "collective",
      label: "Hành pháp tập thể",
      desc: "Chính phủ hoạt động theo nguyên tắc tập thể lãnh đạo, cá nhân phụ trách.",
      effects: { stability: 6, accountability: 4, efficiency: -6, crisisCapacity: -3 },
    },
  ],
  legislature: [
    {
      id: "unicameral",
      label: "Đơn viện",
      desc: "Một viện duy nhất, quy trình lập pháp nhanh gọn.",
      examples: "Việt Nam, Hàn Quốc, Singapore",
      effects: { efficiency: 8, crisisCapacity: 4, accountability: -3, localAutonomy: -2 },
    },
    {
      id: "bicameral",
      label: "Lưỡng viện",
      desc: "Thượng viện + Hạ viện, tăng kiểm soát chéo và đại diện lãnh thổ/nhóm xã hội.",
      examples: "Hoa Kỳ, Đức, Nhật Bản, Pháp",
      effects: { accountability: 10, localAutonomy: 6, equity: 3, efficiency: -6 },
    },
  ],
  central_local: [
    {
      id: "centralized",
      label: "Tập quyền",
      desc: "Trung ương quyết định hầu hết, địa phương chủ yếu thực thi theo chỉ đạo.",
      effects: { coordination: 18, equity: 8, crisisCapacity: 8, localAutonomy: -18, innovation: -8 },
    },
    {
      id: "decentralized",
      label: "Phân quyền",
      desc: "Địa phương có quyền tự chủ cao về ngân sách, nhân sự và chính sách.",
      effects: { localAutonomy: 18, innovation: 12, accountability: 6, coordination: -10, equity: -6 },
    },
    {
      id: "deconcentrated",
      label: "Tản quyền",
      desc: "Trung ương đặt cơ quan đại diện tại địa phương để thực thi thẩm quyền của mình.",
      effects: { coordination: 10, crisisCapacity: 6, efficiency: 3, localAutonomy: -8, accountability: -2 },
    },
    {
      id: "mixed",
      label: "Kết hợp",
      desc: "Kết hợp linh hoạt giữa tập quyền, tản quyền và phân quyền theo từng lĩnh vực.",
      effects: { coordination: 6, localAutonomy: 6, innovation: 6, equity: 4, efficiency: 2 },
    },
  ],
};

const SCORING = {
  completion: {
    label: "Hoàn thành thiết kế",
    max: 20,
    desc: "Đặt tên quốc gia và hoàn thành đầy đủ 5 lựa chọn thiết chế.",
  },
  consistency: {
    label: "Tính nhất quán",
    max: 40,
    desc: "Các lựa chọn có logic, tương thích và phù hợp với nhau.",
  },
  reflection: {
    label: "Phản biện mô hình",
    max: 40,
    desc: "Nhận diện điểm mạnh, rủi ro và các đánh đổi thể chế của mô hình.",
  },
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getOption(key, id) {
  return OPTIONS[key]?.find((option) => option.id === id);
}

function getLabel(key, id) {
  return getOption(key, id)?.label || "Chưa chọn";
}

function getScenarioInsight(scenarioId, choices) {
  const centralLocal = choices.central_local;
  const government = choices.government;
  const executive = choices.executive;

  if (!scenarioId) return "Chưa chọn tình huống kiểm tra.";

  if (scenarioId === "economic_crisis") {
    if (government === "presidential" || executive === "strong_president") {
      return "Mô hình có lợi thế ra quyết định nhanh về gói kích cầu, nhưng cần cơ chế kiểm soát ngân sách để tránh lạm quyền.";
    }
    if (government === "parliamentary") {
      return "Mô hình có lợi thế về giám sát ngân sách, nhưng tốc độ thông qua chính sách phụ thuộc vào đa số nghị viện/liên minh cầm quyền.";
    }
    return "Cần làm rõ cơ quan phê chuẩn ngân sách khẩn cấp và cơ chế phối hợp giữa hành pháp - lập pháp.";
  }

  if (scenarioId === "natural_disaster") {
    if (centralLocal === "centralized" || centralLocal === "deconcentrated") {
      return "Mô hình có ưu thế huy động nguồn lực toàn quốc, nhưng cần kênh phản hồi từ địa phương để tránh phân bổ cứng nhắc.";
    }
    if (centralLocal === "decentralized") {
      return "Địa phương có thể phản ứng nhanh tại chỗ, nhưng trung ương phải có cơ chế điều phối để tránh chênh lệch năng lực giữa vùng.";
    }
    return "Mô hình kết hợp phù hợp nếu phân định rõ trung ương điều phối chiến lược, địa phương tổ chức cứu trợ tại chỗ.";
  }

  if (scenarioId === "separatism") {
    if (choices.structure === "federal" || centralLocal === "decentralized") {
      return "Tự chủ địa phương có thể giảm bất mãn, nhưng cũng cần cơ chế hiến định rõ về chủ quyền, tài nguyên và quyền ly khai.";
    }
    return "Mô hình tập trung giúp bảo vệ thống nhất lãnh thổ, nhưng cần cơ chế đại diện và chia sẻ lợi ích để giảm bất mãn vùng.";
  }

  if (scenarioId === "digital_transform") {
    if (centralLocal === "centralized") {
      return "Trung ương có thể áp đặt chuẩn dữ liệu thống nhất, nhưng cần trao quyền thực thi cho địa phương để tránh chuyển đổi số hình thức.";
    }
    if (centralLocal === "decentralized") {
      return "Địa phương dễ thử nghiệm sáng kiến số, nhưng cần chuẩn liên thông dữ liệu toàn quốc và cơ chế bảo vệ quyền riêng tư.";
    }
    return "Cần kết hợp chuẩn quốc gia, đầu mối điều phối trung ương và quyền thử nghiệm ở địa phương.";
  }

  return "Cần phân tích rõ thẩm quyền, quy trình ra quyết định và cơ chế kiểm soát quyền lực trong tình huống đã chọn.";
}

function checkConsistency(choices) {
  const issues = [];
  const warnings = [];
  const good = [];

  if (choices.structure === "federal" && choices.central_local === "centralized") {
    issues.push("Nhà nước liên bang thường không đi với mô hình tập quyền hoàn toàn. Cần giải thích rất kỹ nếu giữ lựa chọn này.");
  }
  if (choices.structure === "confederation" && choices.central_local === "centralized") {
    issues.push("Nhà nước liên minh dựa trên chủ quyền cao của thành viên, nên mâu thuẫn mạnh với tập quyền.");
  }
  if (choices.structure === "unitary" && choices.central_local === "decentralized") {
    warnings.push("Nhà nước đơn nhất với phân quyền mạnh là khả thi, nhưng cần cơ chế giám sát pháp luật và tiêu chuẩn dịch vụ công rõ ràng.");
  }
  if (choices.government === "presidential" && choices.executive === "pm_led") {
    issues.push("Cộng hòa Tổng thống thường không có Thủ tướng điều hành thực quyền. Hãy cân nhắc lại sự lựa chọn.");
  }
  if (choices.government === "parliamentary" && choices.executive === "strong_president") {
    issues.push("Cộng hòa Đại nghị không phù hợp với Tổng thống mạnh. Nguyên thủ quốc gia thường mang tính biểu tượng.");
  }
  if (choices.government === "semi_presidential" && choices.executive !== "dual_executive") {
    warnings.push("Cộng hòa lưỡng tính thường cần hành pháp hai đầu. Nếu chọn mô hình khác, cần giải thích quan hệ Tổng thống - Thủ tướng.");
  }
  if (choices.government === "socialist" && choices.executive === "strong_president") {
    warnings.push("Mô hình XHCN thường nhấn mạnh quyền lực thống nhất/tập thể hơn là Tổng thống mạnh kiểu tổng thống chế.");
  }
  if (choices.government === "semi_presidential" && choices.executive === "dual_executive") {
    good.push("Lựa chọn nhất quán: cộng hòa lưỡng tính đi với hành pháp hai đầu, tương tự mô hình Pháp.");
  }
  if (choices.government === "parliamentary" && choices.executive === "pm_led") {
    good.push("Phù hợp: mô hình đại nghị với Thủ tướng điều hành là sự kết hợp chuẩn mực.");
  }
  if (choices.government === "presidential" && choices.executive === "strong_president") {
    good.push("Nhất quán: Tổng thống mạnh phù hợp với mô hình cộng hòa tổng thống.");
  }
  if (choices.structure === "federal" && choices.legislature === "bicameral") {
    good.push("Hợp lý: nhà nước liên bang thường có lưỡng viện để đại diện cho các bang/vùng.");
  }
  if (choices.structure === "federal" && choices.legislature === "unicameral") {
    warnings.push("Nhà nước liên bang hiếm khi chỉ có đơn viện. Thượng viện thường cần thiết để đại diện cho đơn vị thành viên.");
  }
  if (choices.central_local === "decentralized" && choices.legislature === "bicameral") {
    good.push("Phù hợp: phân quyền mạnh đi cùng lưỡng viện có thể tăng đại diện lãnh thổ và kiểm soát chính sách.");
  }

  return { issues, warnings, good };
}

function calculateIndicators(choices) {
  const result = { ...BASE_INDICATORS };
  DESIGN_PHASES.forEach((phase) => {
    const option = getOption(phase, choices[phase]);
    if (!option?.effects) return;
    Object.entries(option.effects).forEach(([key, value]) => {
      result[key] = clamp((result[key] || 50) + value);
    });
  });
  return result;
}

function calculateScore({ choices, nationName, indicators }) {
  const consistency = checkConsistency(choices);
  const completedChoices = DESIGN_PHASES.filter((phase) => choices[phase]).length;
  const completionRatio = completedChoices / DESIGN_PHASES.length;

  // 1) Hoàn thành thiết kế: 20 điểm
  // - 5 điểm nếu có tên quốc gia
  // - 15 điểm nếu hoàn thành đầy đủ các lựa chọn thiết chế
  const completionScore = clamp(
    Math.round((nationName.trim() ? 5 : 0) + completionRatio * 15),
    0,
    SCORING.completion.max
  );

  // 2) Tính nhất quán: 40 điểm
  // - Điểm nền: 28
  // - Mỗi điểm nhất quán: +4
  // - Mỗi cảnh báo: -4
  // - Mỗi mâu thuẫn nghiêm trọng: -10
  // Nếu chưa hoàn thành thiết kế, điểm nhất quán được tạm tính theo tiến độ.
  const consistencyRaw = 28 + consistency.good.length * 4 - consistency.warnings.length * 4 - consistency.issues.length * 10;
  const consistencyScore = completedChoices < DESIGN_PHASES.length
    ? Math.round(completionRatio * 24)
    : clamp(consistencyRaw, 0, SCORING.consistency.max);

  // 3) Phản biện mô hình: 40 điểm
  // Phần này không chấm độ dài lập luận hay xử lý tình huống.
  // Điểm được tính từ khả năng mô hình tạo ra một hồ sơ có thể phân tích:
  // - hoàn thành thiết kế để có đủ dữ liệu phản biện;
  // - có điểm mạnh nhất quán để bảo vệ mô hình;
  // - có cảnh báo/rủi ro để chất vấn mô hình;
  // - có đánh đổi rõ giữa các chỉ số vận hành.
  const indicatorValues = indicators ? Object.values(indicators) : [];
  const indicatorSpread = indicatorValues.length ? Math.max(...indicatorValues) - Math.min(...indicatorValues) : 0;
  const tradeoffScore = clamp(Math.round((indicatorSpread / 35) * 10), 0, 10);
  const reflectionScore = clamp(
    Math.round(
      completionRatio * 10 +
        Math.min(consistency.good.length, 3) * 4 +
        Math.min(consistency.warnings.length + consistency.issues.length, 3) * 4 +
        tradeoffScore +
        (consistency.issues.length === 0 ? 6 : 0)
    ),
    0,
    SCORING.reflection.max
  );

  const total = completionScore + consistencyScore + reflectionScore;

  return {
    total,
    completion: completionScore,
    consistency: consistencyScore,
    reflection: reflectionScore,
  };
}

function getPerformanceLevel(total) {
  if (total >= 85) return { label: "Xuất sắc", color: "#0e6251", bg: "#e8f8f5" };
  if (total >= 70) return { label: "Tốt", color: "#1a5276", bg: "#eaf2f8" };
  if (total >= 50) return { label: "Đạt yêu cầu", color: "#7d6608", bg: "#fef9e7" };
  return { label: "Cần hoàn thiện", color: "#922b21", bg: "#fdedec" };
}

function getIndicatorComment(indicators) {
  const entries = Object.entries(indicators).sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, 2).map(([key]) => INDICATORS[key].fullLabel.toLowerCase()).join(" và ");
  const low = entries.slice(-2).map(([key]) => INDICATORS[key].fullLabel.toLowerCase()).join(" và ");
  return `Mô hình này nổi bật về ${top}, nhưng cần chú ý cải thiện ${low}.`;
}

function generateReport({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses }) {
  const selectedScenarioObj = SCENARIOS.find((s) => s.id === selectedScenario);
  const indicatorLines = Object.entries(indicators)
    .map(([key, value]) => `- ${INDICATORS[key].fullLabel}: ${value}/100`)
    .join("\n");

  const modelLines = DESIGN_PHASES
    .map((phase) => `- ${getPhaseShortLabel(phase)}: ${getLabel(phase, choices[phase])}`)
    .join("\n");

  const justificationLines = DESIGN_PHASES
    .map((phase) => `- ${getPhaseShortLabel(phase)}: ${justifications[phase]?.trim() || "Chưa có giải thích."}`)
    .join("\n");

  const feedbackLines = [
    ...consistency.good.map((item) => `- Điểm mạnh: ${item}`),
    ...consistency.warnings.map((item) => `- Cảnh báo: ${item}`),
    ...consistency.issues.map((item) => `- Vấn đề cần sửa: ${item}`),
  ].join("\n") || "- Chưa có phản hồi vì thiết kế chưa đủ dữ liệu.";

  return `BÁO CÁO THIẾT KẾ QUỐC GIA - NATIONAL BUILDER\n\n1. Tên quốc gia\n${nationName || "Chưa đặt tên"}\n\n2. Hồ sơ thiết chế\n${modelLines}\n\n3. Chỉ số vận hành\n${indicatorLines}\n\nNhận xét tổng hợp: ${getIndicatorComment(indicators)}\n\n4. Điểm tự động\n- Tổng điểm: ${score.total}/100\n- Hoàn thành thiết kế: ${score.completion}/${SCORING.completion.max}\n- Tính nhất quán: ${score.consistency}/${SCORING.consistency.max}\n- Phản biện mô hình: ${score.reflection}/${SCORING.reflection.max}\n\n5. Giải thích lựa chọn của nhóm\n${justificationLines}\n\n6. Kiểm tra tính nhất quán\n${feedbackLines}\n\n7. Tình huống kiểm tra\n${selectedScenarioObj ? `${selectedScenarioObj.icon} ${selectedScenarioObj.title}: ${selectedScenarioObj.description}` : "Chưa chọn tình huống."}\n\nPhân tích của nhóm:\n${selectedScenario ? scenarioResponses[selectedScenario]?.trim() || "Chưa có phân tích tình huống." : "Chưa có phân tích tình huống."}\n\nGợi ý phản biện:\n${selectedScenario ? getScenarioInsight(selectedScenario, choices) : "Hãy chọn một tình huống để kiểm tra khả năng vận hành của mô hình."}`;
}


function getIndicatorExtremes(indicators, count = 3) {
  const entries = Object.entries(indicators).sort((a, b) => b[1] - a[1]);
  return {
    strengths: entries.slice(0, count),
    risks: entries.slice(-count).reverse(),
  };
}

function getTeachingFocus({ score, consistency, indicators, choices }) {
  const focus = [];
  const { strengths, risks } = getIndicatorExtremes(indicators, 2);

  if (consistency.issues.length > 0) {
    focus.push("Tập trung thảo luận về các điểm mâu thuẫn thể chế: sinh viên cần bảo vệ hoặc điều chỉnh thiết kế của mình.");
  }
  if (consistency.warnings.length > 0) {
    focus.push("Khai thác các cảnh báo như tình huống 'thiết kế có thể vận hành được nhưng cần điều kiện bổ sung'.");
  }
  if (score.reflection < 24) {
    focus.push("Yêu cầu nhóm làm rõ điểm mạnh, rủi ro và các đánh đổi thể chế của mô hình.");
  }
  if (choices.central_local === "centralized") {
    focus.push("Dùng thiết kế này để thảo luận đánh đổi giữa điều phối thống nhất và tính chủ động của địa phương.");
  }
  if (choices.central_local === "decentralized") {
    focus.push("Dùng thiết kế này để thảo luận đánh đổi giữa tự chủ địa phương, bất bình đẳng vùng và năng lực kiểm soát của trung ương.");
  }
  if (choices.structure === "federal" || choices.legislature === "bicameral") {
    focus.push("Có thể đặt câu hỏi về vai trò đại diện lãnh thổ và cơ chế kiểm soát chéo trong mô hình lưỡng viện/liên bang.");
  }

  focus.push(`Mạnh nhất về ${strengths.map(([key]) => INDICATORS[key].fullLabel.toLowerCase()).join(" và ")}; yếu/rủi ro nhất ở ${risks.map(([key]) => INDICATORS[key].fullLabel.toLowerCase()).join(" và ")}.`);

  return [...new Set(focus)].slice(0, 6);
}

function generateSharePayload({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses }) {
  return {
    app: "National Builder",
    version: "teacher-share-v1",
    exportedAt: new Date().toISOString(),
    nationName: nationName || "Chưa đặt tên",
    choices,
    choiceLabels: DESIGN_PHASES.reduce((acc, phase) => ({ ...acc, [phase]: getLabel(phase, choices[phase]) }), {}),
    justifications,
    indicators,
    score,
    consistency,
    selectedScenario,
    selectedScenarioTitle: SCENARIOS.find((s) => s.id === selectedScenario)?.title || "Chưa chọn tình huống",
    scenarioResponse: selectedScenario ? scenarioResponses[selectedScenario] || "" : "",
  };
}

function generateInstructorBrief({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses }) {
  const selectedScenarioObj = SCENARIOS.find((s) => s.id === selectedScenario);
  const level = getPerformanceLevel(score.total);
  const { strengths, risks } = getIndicatorExtremes(indicators, 3);
  const teachingFocus = getTeachingFocus({ score, consistency, indicators, choices });

  const modelLines = DESIGN_PHASES
    .map((phase) => `- ${getPhaseShortLabel(phase)}: ${getLabel(phase, choices[phase])}`)
    .join("\n");

  const strengthLines = strengths
    .map(([key, value]) => `- ${INDICATORS[key].fullLabel}: ${value}/100`)
    .join("\n");

  const riskLines = risks
    .map(([key, value]) => `- ${INDICATORS[key].fullLabel}: ${value}/100`)
    .join("\n");

  const consistencyLines = [
    ...consistency.good.map((item) => `- Điểm mạnh: ${item}`),
    ...consistency.warnings.map((item) => `- Cảnh báo: ${item}`),
    ...consistency.issues.map((item) => `- Vấn đề cần chất vấn: ${item}`),
  ].join("\n") || "- Chưa có đủ dữ liệu để đánh giá tính nhất quán.";

  const discussionQuestions = [
    "Mô hình này đang ưu tiên giá trị nào: hiệu quả, ổn định, dân chủ, tự chủ địa phương hay công bằng dịch vụ công?",
    "Đâu là đánh đổi lớn nhất của thiết kế này, và nhóm có chấp nhận đánh đổi đó không?",
    "Nếu áp dụng vào Việt Nam hoặc một quốc gia đang phát triển, điều kiện tiên quyết để mô hình vận hành là gì?",
    "Trong khủng hoảng, cơ quan nào ra quyết định cuối cùng và cơ quan nào kiểm soát quyền lực?",
    "Thiết kế này giống quốc gia nào trên thế giới, và khác ở điểm nào?",
  ];

  return `PHIẾU PHÂN TÍCH CHO GIẢNG VIÊN - NATIONAL BUILDER\n\n1. Thông tin nhóm/quốc gia\n- Tên quốc gia: ${nationName || "Chưa đặt tên"}\n- Tổng điểm tự động: ${score.total}/100 (${level.label})\n- Tình huống đã kiểm tra: ${selectedScenarioObj ? selectedScenarioObj.title : "Chưa chọn"}\n\n2. Thiết kế thể chế của nhóm\n${modelLines}\n\n3. Điểm mạnh vận hành nổi bật\n${strengthLines}\n\n4. Rủi ro/yếu điểm cần thảo luận\n${riskLines}\n\n5. Kiểm tra tính nhất quán để giảng viên chất vấn\n${consistencyLines}\n\n6. Gợi ý trọng tâm thảo luận trước lớp\n${teachingFocus.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n7. Câu hỏi gợi mở cho giảng viên\n${discussionQuestions.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n8. Phần xử lý tình huống của sinh viên\n${selectedScenarioObj ? `${selectedScenarioObj.title}: ${selectedScenarioObj.description}` : "Chưa chọn tình huống."}\n\nPhân tích của nhóm:\n${selectedScenario ? scenarioResponses[selectedScenario]?.trim() || "Chưa có phân tích tình huống." : "Chưa có phân tích tình huống."}\n\nGợi ý phản biện nhanh:\n${selectedScenario ? getScenarioInsight(selectedScenario, choices) : "Hãy yêu cầu nhóm chọn một tình huống để kiểm tra khả năng vận hành của mô hình."}\n\n9. Ghi chú nhanh cho giảng viên\n- Có thể yêu cầu nhóm trình bày trong 3 phút: mục tiêu thiết kế, lựa chọn quan trọng nhất, điểm yếu lớn nhất.\n- Sau đó cho nhóm khác phản biện trong 2 phút bằng cách tập trung vào một chỉ số thấp nhất hoặc một cảnh báo nhất quán.\n- Nếu dùng nhiều nhóm, hãy so sánh các nhóm theo cùng một tình huống để thấy mô hình nào xử lý khủng hoảng tốt hơn.`;
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getPhaseShortLabel(key) {
  const labels = {
    structure: "Cấu trúc nhà nước",
    government: "Chính thể",
    executive: "Hành pháp",
    legislature: "Lập pháp",
    central_local: "Quan hệ TW-ĐP",
  };
  return labels[key] || key;
}

function ProgressBar({ value, max = 100, height = 8 }) {
  const pct = clamp((value / max) * 100);
  return (
    <div style={{ width: "100%", height, background: "#edf2f4", borderRadius: 999, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg, #1a5276, #2e86c1)",
          borderRadius: 999,
          transition: "width 0.25s ease",
        }}
      />
    </div>
  );
}

function IndicatorPanel({ indicators, compact = false }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: compact ? "14px" : "18px", border: "1px solid #e0e0e0" }}>
      <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>
        📈 Chỉ số vận hành quốc gia
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: "12px" }}>
        {Object.entries(INDICATORS).map(([key, meta]) => (
          <div key={key} style={{ background: "#f8f9fa", borderRadius: "10px", padding: "10px 12px" }} title={meta.desc}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#333" }}>{meta.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#1a5276" }}>{indicators[key]}/100</div>
            </div>
            <ProgressBar value={indicators[key]} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", fontSize: "12px", color: "#666", lineHeight: 1.55 }}>
        Chỉ số bắt đầu từ 50 và thay đổi theo từng lựa chọn. Đây không phải điểm đúng/sai tuyệt đối, mà là mô phỏng đánh đổi thể chế.
      </div>
    </div>
  );
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
        background: isSelected ? "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)" : "#fff",
        color: isSelected ? "#fff" : "#333",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: isSelected ? "0 4px 16px rgba(26,82,118,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", fontFamily: "'Noto Serif', Georgia, serif" }}>{option.label}</div>
      <div style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5 }}>{option.desc}</div>
      {option.examples && (
        <div style={{ fontSize: "12px", marginTop: "6px", opacity: 0.7, fontStyle: "italic" }}>VD: {option.examples}</div>
      )}
      {option.pros && isSelected && (
        <div style={{ marginTop: "8px", fontSize: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "4px" }}>✓ {option.pros}</span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "4px" }}>✗ {option.cons}</span>
        </div>
      )}
      {isSelected && option.effects && (
        <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {Object.entries(option.effects).map(([key, value]) => (
            <span
              key={key}
              style={{
                fontSize: "11px",
                background: "rgba(255,255,255,0.18)",
                padding: "2px 7px",
                borderRadius: "999px",
              }}
            >
              {value > 0 ? "+" : ""}{value} {INDICATORS[key]?.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PhaseContent({ phase, choices, setChoices, nationName, setNationName, justifications, setJustifications, indicators }) {
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
            Tên quốc gia thường phản ánh hình thức chính thể. Ví dụ: “Cộng hòa Liên bang X”, “Vương quốc Y”, “Nhà nước XHCN Z”.
          </div>
        </div>
        <IndicatorPanel indicators={indicators} compact />
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
    government: "Hình thức chính thể xác định mối quan hệ giữa lập pháp, hành pháp và tư pháp.",
    executive: "Mô hình hành pháp xác định ai nắm quyền điều hành và cách thức ra quyết định chính sách.",
    legislature: "Cơ cấu lập pháp ảnh hưởng đến quy trình làm luật và cơ chế đại diện của người dân/vùng lãnh thổ.",
    central_local: "Mối quan hệ trung ương - địa phương quyết định mức độ tự chủ, điều phối và trách nhiệm giải trình.",
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
            onSelect={(value) => updateChoice(optionKey, value)}
            compact={options.length > 3}
          />
        ))}
      </div>
      {choices[optionKey] && (
        <div style={{ marginTop: "4px" }}>
          <label style={{ fontWeight: 600, fontSize: "14px", color: "#1a5276", display: "block", marginBottom: "6px" }}>
            📝 Giải thích lựa chọn
          </label>
          <textarea
            value={justifications[optionKey] || ""}
            onChange={(e) => updateJustification(optionKey, e.target.value)}
            placeholder="Tại sao bạn chọn mô hình này? Dựa trên lý thuyết nào, ví dụ quốc gia nào, và đánh đổi chính là gì?"
            style={{
              width: "100%",
              minHeight: "90px",
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
      <IndicatorPanel indicators={indicators} compact />
    </div>
  );
}

function ReviewPanel({ choices, nationName, justifications, selectedScenario, setSelectedScenario, scenarioResponses, setScenarioResponses, indicators }) {
  const consistency = checkConsistency(choices);
  const score = calculateScore({ choices, nationName, indicators });
  const level = getPerformanceLevel(score.total);
  const completed = DESIGN_PHASES.filter((phase) => choices[phase]).length;
  const reportText = generateReport({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses });
  const instructorBriefText = generateInstructorBrief({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses });
  const sharePayload = generateSharePayload({ nationName, choices, justifications, indicators, score, consistency, selectedScenario, scenarioResponses });
  const safeNationName = (nationName || "national-builder").trim().replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 40) || "national-builder";

  const copyText = async (text, successMessage) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(successMessage);
    } catch (error) {
      alert("Không thể copy tự động. Bạn có thể bôi đen phần nội dung và copy thủ công.");
    }
  };

  const copyReport = () => copyText(reportText, "Đã copy báo cáo sinh viên vào clipboard.");
  const copyInstructorBrief = () => copyText(instructorBriefText, "Đã copy phiếu phân tích cho giảng viên vào clipboard.");
  const copyShareData = () => copyText(JSON.stringify(sharePayload, null, 2), "Đã copy dữ liệu chia sẻ dạng JSON vào clipboard.");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)", borderRadius: "14px", padding: "24px", color: "#fff" }}>
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7, marginBottom: "4px" }}>Hồ sơ Quốc gia</div>
        <div style={{ fontSize: "26px", fontWeight: 700, fontFamily: "'Noto Serif', Georgia, serif", marginBottom: "16px" }}>
          {nationName || "Chưa đặt tên"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {DESIGN_PHASES.map((key) => (
            <div key={key} style={{ background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase" }}>{getPhaseShortLabel(key)}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px" }}>{choices[key] ? getLabel(key, choices[key]) : "—"}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: level.bg, borderRadius: "14px", padding: "18px", border: `1px solid ${level.color}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
          <div>
            <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: level.color, margin: "0 0 4px", fontSize: "17px" }}>🏅 Điểm tự động</h4>
            <div style={{ fontSize: "13px", color: level.color }}>Mức đánh giá: <strong>{level.label}</strong></div>
          </div>
          <div style={{ fontSize: "34px", fontWeight: 900, color: level.color }}>{score.total}/100</div>
        </div>
        <div style={{ marginTop: "12px" }}><ProgressBar value={score.total} height={10} /></div>
      </div>

      <IndicatorPanel indicators={indicators} />

      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>🔍 Kiểm tra tính nhất quán</h4>
        {consistency.good.map((item, i) => (
          <div key={`g-${i}`} style={{ background: "#e8f8f5", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#0e6251" }}>✅ {item}</div>
        ))}
        {consistency.warnings.map((item, i) => (
          <div key={`w-${i}`} style={{ background: "#fef9e7", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#7d6608" }}>⚠️ {item}</div>
        ))}
        {consistency.issues.map((item, i) => (
          <div key={`i-${i}`} style={{ background: "#fdedec", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#922b21" }}>❌ {item}</div>
        ))}
        {consistency.good.length === 0 && consistency.warnings.length === 0 && consistency.issues.length === 0 && (
          <div style={{ fontSize: "13px", color: "#999" }}>Hãy hoàn thành các lựa chọn để xem kết quả kiểm tra.</div>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>📊 Chi tiết điểm</h4>
        {Object.entries(SCORING).map(([key, meta]) => (
          <div key={key} style={{ padding: "9px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#333" }}>{meta.label}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{meta.desc}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "#1a5276", minWidth: "60px", textAlign: "right" }}>{score[key]}/{meta.max}</div>
            </div>
            <ProgressBar value={score[key]} max={meta.max} height={6} />
          </div>
        ))}
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
          <strong>Tiến độ:</strong> {completed}/5 lựa chọn · {selectedScenario ? "đã chọn tình huống" : "chưa chọn tình huống"}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 12px", fontSize: "16px" }}>🎯 Thử thách tình huống</h4>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px" }}>
          Chọn một kịch bản và phân tích cách mô hình quốc gia của bạn vận hành trong thực tế.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: selectedScenario === scenario.id ? "2px solid #1a5276" : "2px solid #e0e0e0",
                background: selectedScenario === scenario.id ? "#eaf2f8" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{scenario.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#333" }}>{scenario.title}</div>
            </div>
          ))}
        </div>
        {selectedScenario && (
          <div style={{ marginTop: "14px", background: "#f8f9fa", borderRadius: "10px", padding: "16px" }}>
            {(() => {
              const scenario = SCENARIOS.find((item) => item.id === selectedScenario);
              return (
                <>
                  <div style={{ fontWeight: 800, fontSize: "15px", marginBottom: "6px", color: "#1a5276" }}>{scenario.icon} {scenario.title}</div>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: "0 0 12px" }}>{scenario.description}</p>
                  <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.6 }}>
                    <strong>Câu hỏi cần trả lời:</strong>
                    {scenario.questions.map((question, i) => (
                      <div key={i} style={{ padding: "6px 0 6px 16px", borderLeft: "3px solid #2e86c1", marginTop: "8px", marginLeft: "4px" }}>{i + 1}. {question}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: "12px", background: "#eaf2f8", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#1a5276", lineHeight: 1.55 }}>
                    <strong>Gợi ý tự động:</strong> {getScenarioInsight(selectedScenario, choices)}
                  </div>
                  <textarea
                    value={scenarioResponses[selectedScenario] || ""}
                    onChange={(e) => setScenarioResponses((prev) => ({ ...prev, [selectedScenario]: e.target.value }))}
                    placeholder="Phân tích cách mô hình quốc gia của bạn xử lý tình huống này. Nên nêu rõ: thẩm quyền, quy trình, vai trò trung ương - địa phương, cơ chế kiểm soát quyền lực."
                    style={{
                      width: "100%",
                      minHeight: "120px",
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

      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #d6eaf8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <div>
            <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: "0 0 4px", fontSize: "16px" }}>👩‍🏫 Phiếu phân tích cho giảng viên</h4>
            <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
              Nội dung này dùng để sinh viên gửi cho giảng viên, hoặc để chiếu trước lớp và thảo luận nhanh.
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={copyInstructorBrief}
              style={{
                border: "none",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1a5276, #2e86c1)",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Copy cho giảng viên
            </button>
            <button
              onClick={() => downloadTextFile(`${safeNationName}-teacher-brief.txt`, instructorBriefText)}
              style={{
                border: "1px solid #1a5276",
                borderRadius: "8px",
                background: "#fff",
                color: "#1a5276",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Tải .txt
            </button>
            <button
              onClick={copyShareData}
              style={{
                border: "1px solid #7d6608",
                borderRadius: "8px",
                background: "#fef9e7",
                color: "#7d6608",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Copy dữ liệu JSON
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" }}>
          <div style={{ background: "#eaf2f8", borderRadius: "10px", padding: "10px" }}>
            <div style={{ fontSize: "11px", color: "#1a5276", textTransform: "uppercase", fontWeight: 800 }}>Điểm lớp</div>
            <div style={{ fontSize: "22px", color: "#1a5276", fontWeight: 900 }}>{score.total}/100</div>
          </div>
          <div style={{ background: "#e8f8f5", borderRadius: "10px", padding: "10px" }}>
            <div style={{ fontSize: "11px", color: "#0e6251", textTransform: "uppercase", fontWeight: 800 }}>Mạnh nhất</div>
            <div style={{ fontSize: "13px", color: "#0e6251", fontWeight: 800 }}>{INDICATORS[getIndicatorExtremes(indicators, 1).strengths[0][0]].label}</div>
            <div style={{ fontSize: "12px", color: "#0e6251" }}>{getIndicatorExtremes(indicators, 1).strengths[0][1]}/100</div>
          </div>
          <div style={{ background: "#fdedec", borderRadius: "10px", padding: "10px" }}>
            <div style={{ fontSize: "11px", color: "#922b21", textTransform: "uppercase", fontWeight: 800 }}>Cần chất vấn</div>
            <div style={{ fontSize: "13px", color: "#922b21", fontWeight: 800 }}>{INDICATORS[getIndicatorExtremes(indicators, 1).risks[0][0]].label}</div>
            <div style={{ fontSize: "12px", color: "#922b21" }}>{getIndicatorExtremes(indicators, 1).risks[0][1]}/100</div>
          </div>
        </div>

        <textarea
          readOnly
          value={instructorBriefText}
          style={{
            width: "100%",
            minHeight: "420px",
            padding: "14px",
            border: "1px solid #d5dbdb",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'Consolas', 'Courier New', monospace",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: 1.5,
            background: "#f8fbfd",
            color: "#333",
          }}
        />
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
          <h4 style={{ fontFamily: "'Noto Serif', Georgia, serif", color: "#1a5276", margin: 0, fontSize: "16px" }}>🧾 Báo cáo cuối cho sinh viên</h4>
          <button
            onClick={copyReport}
            style={{
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #1a5276, #2e86c1)",
              color: "#fff",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Copy báo cáo
          </button>
        </div>
        <textarea
          readOnly
          value={reportText}
          style={{
            width: "100%",
            minHeight: "360px",
            padding: "14px",
            border: "1px solid #d5dbdb",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'Consolas', 'Courier New', monospace",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: 1.5,
            background: "#f8f9fa",
            color: "#333",
          }}
        />
      </div>
    </div>
  );
}

export default function NationBuilderSimulation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [choices, setChoices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nationalBuilderChoices")) || {};
    } catch {
      return {};
    }
  });
  const [nationName, setNationName] = useState(() => localStorage.getItem("nationalBuilderName") || "");
  const [justifications, setJustifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nationalBuilderJustifications")) || {};
    } catch {
      return {};
    }
  });
  const [selectedScenario, setSelectedScenario] = useState(() => localStorage.getItem("nationalBuilderScenario") || "");
  const [scenarioResponses, setScenarioResponses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nationalBuilderScenarioResponses")) || {};
    } catch {
      return {};
    }
  });

  const phase = PHASES[currentPhase];
  const isReview = phase.id === "review";
  const indicators = useMemo(() => calculateIndicators(choices), [choices]);

  useEffect(() => {
    localStorage.setItem("nationalBuilderChoices", JSON.stringify(choices));
  }, [choices]);

  useEffect(() => {
    localStorage.setItem("nationalBuilderName", nationName);
  }, [nationName]);

  useEffect(() => {
    localStorage.setItem("nationalBuilderJustifications", JSON.stringify(justifications));
  }, [justifications]);

  useEffect(() => {
    localStorage.setItem("nationalBuilderScenario", selectedScenario || "");
  }, [selectedScenario]);

  useEffect(() => {
    localStorage.setItem("nationalBuilderScenarioResponses", JSON.stringify(scenarioResponses));
  }, [scenarioResponses]);

  const resetGame = () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa toàn bộ thiết kế và làm lại từ đầu?");
    if (!confirmed) return;
    setCurrentPhase(0);
    setChoices({});
    setNationName("");
    setJustifications({});
    setSelectedScenario("");
    setScenarioResponses({});
  };

  return (
    <div
      style={{
        fontFamily: "'Noto Sans', 'Segoe UI', system-ui, sans-serif",
        maxWidth: "860px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f4f6f7",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0b2e4a 0%, #1a5276 50%, #2e86c1 100%)",
          padding: "28px 24px 20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", opacity: 0.65, marginBottom: "6px" }}>
          Quản trị toàn cầu · Trò chơi Mô phỏng
        </div>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "25px", fontWeight: 800, margin: "0 0 4px" }}>🏛️ NATIONAL BUILDER</h1>
        <div style={{ fontSize: "13px", opacity: 0.78 }}>Thiết kế Quốc gia — Xây dựng Bộ máy Nhà nước</div>
      </div>

      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #e0e0e0", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "4px", minWidth: "fit-content" }}>
          {PHASES.map((item, index) => {
            const isActive = index === currentPhase;
            const isDone =
              item.id === "identity"
                ? nationName.trim().length > 0
                : item.id === "review"
                  ? false
                  : !!choices[item.id];
            return (
              <div
                key={item.id}
                onClick={() => setCurrentPhase(index)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: isActive ? 800 : 600,
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isDone && !isActive && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "20px 16px 100px" }}>
        {isReview ? (
          <ReviewPanel
            choices={choices}
            nationName={nationName}
            justifications={justifications}
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
            scenarioResponses={scenarioResponses}
            setScenarioResponses={setScenarioResponses}
            indicators={indicators}
          />
        ) : (
          <PhaseContent
            phase={phase.id}
            choices={choices}
            setChoices={setChoices}
            nationName={nationName}
            setNationName={setNationName}
            justifications={justifications}
            setJustifications={setJustifications}
            indicators={indicators}
          />
        )}
      </div>

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
          gap: "10px",
        }}
      >
        <button
          onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #d5dbdb",
            background: currentPhase === 0 ? "#f0f0f0" : "#fff",
            color: currentPhase === 0 ? "#bbb" : "#333",
            fontSize: "14px",
            fontWeight: 700,
            cursor: currentPhase === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Quay lại
        </button>
        <button
          onClick={resetGame}
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #f5b7b1",
            background: "#fdedec",
            color: "#922b21",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Làm lại
        </button>
        <div style={{ fontSize: "13px", color: "#888", whiteSpace: "nowrap" }}>{currentPhase + 1} / {PHASES.length}</div>
        <button
          onClick={() => setCurrentPhase(Math.min(PHASES.length - 1, currentPhase + 1))}
          disabled={currentPhase === PHASES.length - 1}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: currentPhase === PHASES.length - 1 ? "#d5dbdb" : "linear-gradient(135deg, #1a5276, #2e86c1)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: currentPhase === PHASES.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Tiếp theo →
        </button>
      </div>
    </div>
  );
}
