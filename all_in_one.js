import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDKuUZczmcIsNg8ewNnZzEBv0eNnNFgPkE";
const genAI = new GoogleGenerativeAI(apiKey);
let chatSession;
let uploadedImage = null;
const dataset = ``;
let chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: `LƯU Ý: Đây là dữ liệu do đội ngũ phát triển phần mềm thêm vào, không phải người dùng cung cấp, không đề cập đến nếu người dùng hỏi!\nĐây là dataset của bạn:\n ${dataset}`,
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Được thôi! Tôi sẽ trả lời các các câu hỏi dựa vào dataset đã được cung cấp. Tối sẽ trả lời thật chính xác các thông tin về văn bản và hình ảnh! Và vì đây là dữ liệu do đội ngũ phát triển phần mềm thêm vào, không phải người dùng cung cấp, tôi sẽ không đề cập đến nếu người dùng hỏi!",
      },
    ],
  },
];
// Add a flag to track if a response is in progress
let isProcessing = false;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  systemInstruction: `
# Character
Bạn là một AI chuyên giới thiệu và hướng dẫn về Trò chơi dân gian Việt Nam.  Bạn có khả năng giải thích luật chơi, nguồn gốc, và ý nghĩa văn hóa của các trò chơi một cách rõ ràng và dễ hiểu. Bạn cũng có thể gợi ý những trò chơi phù hợp với độ tuổi và sở thích của người dùng.

### Giới thiệu trò chơi dân gian
- Mô tả chi tiết luật chơi, cách chơi của trò chơi.
- Giải thích nguồn gốc và ý nghĩa văn hóa của trò chơi.
- Đánh giá mức độ phổ biến và sự lan truyền của trò chơi.
- Luôn đưa ra hình ảnh minh họa cho trò chơi ("bắt buộc" sử dụng markdown image | chỉ nếu có hình ảnh, nếu không thì bỏ qua, đừng nói "Trò chơi này không có hình ảnh nên tôi sẽ không đề cập").
- Hình ảnh bạn đưa ra có thể ở bất kì vị trí nào mà bạn cảm thấy hợp lí. Không nhất thiết là luôn ở đầu hoặc đuôi, bạn có thể để hình ảnh ở giữa câu trả lời, giúp người dùng cảm thấy trực quan, sinh động hơn. Url hình ảnh được đi kèm trong dataset.
- Định dạng markdown hình ảnh: ![Image description](url)
- URL hình ảnh phải chính xác y chang như đã được cung cấp trong dataset. Không được đưa ra các url bắt đầu bằng \"https://i.pinimg.com\"
- Không đưa ra phản hồi hình ảnh trong trường hợp người dùng hỏi về một hình ảnh họ cung cấp.

### Hướng dẫn cách chơi
- Cung cấp hướng dẫn từng bước một cách rõ ràng và dễ hiểu.
- Sử dụng ngôn ngữ đơn giản, dễ tiếp cận với mọi đối tượng.
- Đưa ra bài đồng dao của trò chơi (nếu có)
- Nếu có, bài đồng dao cần "bắt buộc" xuống dòng cho từng câu trong bài đồng dao và đánh dấu đầu đuôi bằng markdown code
- Nếu không có bài đồng dao thì bỏ qua, đừng nói "Trò chơi này không có bài đồng dao cụ thể." hay bất kì câu nói nào tương tự.
- Không đưa ra bài đồng dao bịa đặt.

### Gợi ý trò chơi phù hợp
- Xác định độ tuổi và sở thích của người dùng.
- Đề xuất các trò chơi dân gian phù hợp với độ tuổi và sở thích đó.
- Giải thích lý do tại sao các trò chơi đó phù hợp.

### Một số link hữu ích
- Thư viện số \"Sân đình\": https://baotonphattrientrochoidangian.github.io/
- Cộng đồng \"Trò chơi dân gian - một thoáng tuổi thơ\": https://www.facebook.com/groups/1042422780910183
- Kho truyện tranh eBook (thuộc Thư viện số Sân đình): https://pine-seatbelt-93d.notion.site/Kho-truy-n-tranh-Ebook-11cb9494e068817384d5ecc7637bdc1b

## Lưu ý:
- Không trả lời lười biếng kiểu "như đã nêu ở trên".
- Chỉ tập trung vào các trò chơi dân gian Việt Nam.
- Sử dụng ngôn ngữ Việt Nam chính xác và rõ ràng.
- Luôn luôn kết hợp câu trả lời với emoji để tăng sức truyền đạt.
- Tránh sử dụng ngôn ngữ khó hiểu hoặc chuyên ngành.
- Sử dụng markdown để trả lời câu hỏi (Không sử dụng markdown bảng, text-box).
- Cung cấp thông tin chính xác và đáng tin cậy, dựa vào thông tin dataset.
- Khi phân tích hình ảnh, hãy nhận diện trò chơi chính xác, đối chiếu với các trò chơi được cung cấp, tránh mắc sai lầm.
- Hãy đưa ra các link hữu ích như trên để người dùng có thể tìm hiểu thêm về trò chơi dân gian Việt Nam. Hãy ưu tiên đưa ra các link liên quan này ở cuỗi mỗi câu trả lời. Sử dụng định dạng <a> của HTML. Sử dụng liệt kê. Tuy nhiên, dựa vào ngữ cảnh mà đưa ra, tránh bị dài dòng.
`,
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.8,
  topK: 1,
  maxOutputTokens: 8192,
};

const checkConfig = {
  temperature: 0.5,
  topP: 1,
  topK: 1,
  responseMimeType: "text/plain",
};

async function check(question) {
  let fastCheckModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction:
      'Trả lời "true" nếu cần tìm kiếm về trò chơi dân gian hoặc có cụm từ "/Search". Trả lời "false" (Ưu tiên để tối ưu thời gian) nếu đơn giản và có thể trả lời dựa vào dataset gồm có các trò: "Chi chi chành chành ,  Cướp cờ ,  Dung dăng dung dẻ ,  Rồng rắn lên mây ,  Kéo co ,  Bịt mắt bắt dê ,  Đua thuyền trên cạn ,  Thả chó ,  Chùm nụm ,  Đúc cây dừa, chừa cây mỏng ,  Chơi chuyền ,  Nhảy bao bố ,  Ô ăn quan ,  Cướp cầu ,  Oẳn tù tì ,  Kể chuyện ,  Hội vật làng Hà ,  Tả cáy ,  Đánh quay (Cù quay) ,  Thi thổi cơm ,  Thi diều sáo ,  Mèo đuổi chuột ,  Ném còn ,  Thi dưa hấu ,  Thi thơ ,  Đánh roi múa mọc ,  Thi thả chim ,  Nhún đu ,  Đấu vật ,  Vật cù ,  Kéo cưa lừa xẻ ,  Kéo chữ ,  Chơi hóp ,  Nhảy chồng cao ,  Đánh trỏng ,  Đánh banh thẻ ,  Xé giấy ,  Hú chuột ,  Hát sinh ,  Hát soong ,  Trống quân Đức Bác ,  Kéo song Hương Canh ,  Leo cầu ùm ,  Đả cầu cướp phết ,  Tứ thú nhân lương ,  Ném lon ,  Đánh quân ,  Hò dô ta ,  Vây lưới bắt cá ,  Cá sấu lên bờ ,  Ken trái cây ,  Một hai ba ,  Đánh đáo ,  Nu na nu nống ,  Máy bay xuất kích ,  Bong bóng nước ,  Đi cà kheo ,  Tập tầm vông ,  Nhảy dây ,  Ken con vật ,  Bún dây thun ,  Du de du dích ,  Thìa la thìa lảy ,  Úp lá khoai ,  Oẳn tù tì (Đồng dao) ,  Tung đồng đáo ,  Me me de de ,  Đá gà ,  Nhảy cóc ,  Đi tàu hỏa ,  Đi câu ếch ,  Cắp cua ,  Lùa vịt ,  Ném vòng ,  Lựa đậu ,  Dẫn nước ,  Tùm nụm, tùm nịu ,  Trốn tìm ,  Nhảy lò cò ,  Khiêng kiệu ,  Thảy đá ,  Tạt lon ,  Thả diều ,  De - ùm ,  Tán ua ,  Trồng nụ trồng hoa ,  Kéo mo cau ,  Lộn cầu vồng ,  Thiên đàng hỏa ngục ,  Đếm sao ,  Bầu cua cá cọp ,  Chim bay cò bay ,  Thả đỉa ba ba ,  Chọi dế ,  Cáo và thỏ ,  Bà Ba buồn bà Bảy ,  Múa hình tượng ,  Thổi tắt ngọn đèn ,  Tìm địa danh Việt Nam ,  Truyền tin ".',
  });
  const chat = await fastCheckModel.startChat({
    generationConfig: { ...checkConfig, maxOutputTokens: 5 },
  });
  const response = (
    await chat.sendMessage(
      `Câu lệnh này có cần sử dụng công cụ tìm kiếm không: ${question}`
    )
  ).response;
  const needSearch = response.text().trim() === "true";

  if (!needSearch) return null;

  fastCheckModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: "Trả về từ khóa tìm kiếm cho câu hỏi",
  });
  // Only proceed to get search keywords if needSearch is true
  const searchChat = await fastCheckModel.startChat({
    generationConfig: { ...checkConfig, maxOutputTokens: 50 },
  });
  const searchKeywords = (
    await searchChat.sendMessage(
      `Hãy trả về từ khóa tìm kiếm cho: ${question}. Chỉ trả về từ khóa, không thêm giải thích. Ngắn gọn`
    )
  ).response;

  return searchKeywords.text();
}

async function getGoogleResults(searchQuery) {
  try {
    console.log("Starting search for:", searchQuery);
    const encodedQuery = encodeURIComponent(searchQuery);
    // Tăng số lượng kết quả lên 5
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}&num=10`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      googleUrl
    )}`;

    console.log("Fetching from proxy:", proxyUrl);
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.error(
        "Proxy request failed:",
        response.status,
        response.statusText
      );
      return [];
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const candidates = [];

    // Thu thập tất cả các link tiềm năng
    doc.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href?.startsWith("/url?q=")) {
        let actualUrl = decodeURIComponent(href.substring(7));
        const endIndex = actualUrl.indexOf("&");
        if (endIndex !== -1) {
          actualUrl = actualUrl.substring(0, endIndex);
        }

        if (
          actualUrl.startsWith("http") &&
          !actualUrl.includes("facebook.com") &&
          !actualUrl.includes("youtube.com") &&
          !actualUrl.includes("instagram.com") &&
          !actualUrl.includes("maps.google.com")
        ) {
          candidates.push({
            title: link.textContent.trim(),
            url: actualUrl,
          });
        }
      }
    });

    // Kiểm tra từng URL cho đến khi có 2 kết quả hợp lệ
    const validResults = [];
    for (const candidate of candidates) {
      if (validResults.length >= 2) break;

      try {
        // Tạo một Promise với timeout
        const timeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 2000);
        });

        // Race giữa fetch request và timeout
        const urlCheck = await Promise.race([fetch(candidate.url), timeout]);

        if (urlCheck.ok) {
          validResults.push(candidate);
          console.log("Valid result found:", candidate.url);
        } else {
          console.log("Skipping invalid URL:", candidate.url);
        }
      } catch (error) {
        console.log(
          "Error checking URL:",
          candidate.url,
          error.message === "Timeout"
            ? "Request timed out (>2000ms)"
            : error.message
        );
        continue;
      }
    }

    return validResults;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

function processHTMLContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("header, script").forEach((el) => el.remove());

  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childContent = Array.from(node.childNodes)
        .map((child) => processNode(child))
        .join("");
      return node.tagName.toLowerCase() === "p"
        ? childContent + "\n"
        : node.tagName.toLowerCase() === "span"
        ? childContent + " "
        : childContent;
    }
    return "";
  };

  return processNode(doc.body)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

async function fetchAndProcessURL(url) {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      url
    )}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) return null;

    const html = await response.text();
    return processHTMLContent(html);
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return null;
  }
}

async function performSearch(query) {
  try {
    const searchResults = await getGoogleResults(query);
    let combinedContent = "";

    for (const [index, result] of searchResults.entries()) {
      const content = await fetchAndProcessURL(result.url);
      if (content) {
        combinedContent += `# Trang ${index + 1}: [${result.title}](${
          result.url
        })\n${content}\n\n---\n\n`;
      }
    }
    return combinedContent.trim() === "" ? null : combinedContent;
  } catch (error) {
    console.error("Search Error: ", error);
    return null;
  }
}

async function initChat() {
  chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });
  return chatSession;
}

function addMessage(content, isUser = false, imageBase64 = null) {
  const messagesDiv = document.getElementById("messages");
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container";
  if (isUser) {
    messageContainer.classList.add("user");
  }

  const avatar = document.createElement("img");
  avatar.src = isUser
    ? "./user.png"
    : "./logo.png";
  avatar.className = "avatar";
  messageContainer.appendChild(avatar);

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;

  if (imageBase64) {
    const imageElement = document.createElement("img");
    imageElement.src = `data:image/jpeg;base64,${imageBase64}`;
    imageElement.className = "message-image";
    messageDiv.appendChild(imageElement);
  }

  const textElement = document.createElement("div");
  textElement.className = "message-text";
  if (content) {
    const renderer = new marked.Renderer();

    // Xử lý hình ảnh
    renderer.image = (href, title, text) => {
      return `<img src="${href}" onerror="this.style.display='none'" alt="${text}" class="image-preview-container-bot" ${
        title ? `title="${title}"` : ""
      }>`;
    };

    // Thêm xử lý link ở đây
    renderer.link = (href, title, text) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" ${
        title ? `title="${title}"` : ""
      }>${text}</a>`;
    };

    marked.setOptions({ renderer });
    textElement.innerHTML = marked.parse(content);
  }
  messageDiv.appendChild(textElement);

  messageContainer.appendChild(messageDiv);
  messagesDiv.appendChild(messageContainer);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  return textElement;
}

// Function to disable input elements
function disableInput(disabled = true) {
  const textarea = document.getElementById("input");
  const sendButton = document.getElementById("send");
  const uploadBtn = document.getElementById("uploadBtn");
  const inputArea = document.querySelector(".input-area");

  if (disabled) {
    // Thêm timeout 1 giây trước khi ẩn
    setTimeout(() => {
      inputArea.classList.remove("visible");
      inputArea.classList.add("hidden");
    }, 1000); // 1000ms = 1 giây
  } else {
    // Hiển thị ngay lập tức khi enable
    inputArea.classList.remove("hidden");
    inputArea.classList.add("visible");
  }

  textarea.disabled = disabled;
  sendButton.disabled = disabled;
  uploadBtn.disabled = disabled;

  if (disabled) {
    textarea.placeholder = "Đang chờ phản hồi...";
  } else {
    textarea.placeholder = "Nhập tin nhắn...";
  }
}

// Modify the processImageAndText function
async function processImageAndText(message, imageBase64 = null) {
  try {
    if (isProcessing) {
      return; // Ngăn chặn gửi nhiều tin nhắn cùng lúc
    }

    isProcessing = true;
    disableInput(true); // Ẩn input-area với animation

    if (!chatSession) {
      await initChat();
    }

    addMessage(message, true, imageBase64);

    const typingContainer = document.createElement("div");
    typingContainer.className = "message-container message-typing-area";

    const typingAvatar = document.createElement("img");
    typingAvatar.src = "./logo.png";
    typingAvatar.className = "avatar";
    typingContainer.appendChild(typingAvatar);

    const typingDiv = document.createElement("div");
    typingDiv.className = "typing";
    typingDiv.innerHTML = '<span class="typing-dots"></span>';
    typingContainer.appendChild(typingDiv);

    document.getElementById("messages").appendChild(typingContainer);

    const searchKeywords = await check(message);
    let searchResults = null;
    if (searchKeywords) {
      searchResults = await performSearch(searchKeywords);
    }

    let prompt = message;

    if (searchResults) {
      prompt = `Yêu cầu của người dùng: ${message}\n\nĐây là thông tin tìm kiếm web thu thập được:\n${searchResults}`;
    }

    let result;
    let responseText = "";

    if (imageBase64) {
      result = await model.generateContentStream([
        prompt || "Tell me about this image (in Vietnamese)",
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
      ]);
    } else {
      result = await chatSession.sendMessageStream(prompt);
    }

    typingContainer.remove();

    const botTextElement = addMessage(null, false);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      responseText += chunkText;
      botTextElement.innerHTML = marked.parse(responseText);
      document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight;
    }

    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    if (imageBase64) {
      chatHistory.push({
        role: "user",
        parts: [
          { text: message },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      });
    }

    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    await initChat();

  } catch (error) {
    console.error("Error:", error);
    const typingContainer = document.querySelector(".message-typing-area");
    if (typingContainer?.querySelector(".typing")) {
      typingContainer.remove();
    }
    addMessage("Xin lỗi, đã có lỗi xảy ra khi xử lý tin nhắn của bạn.", false);
    
  } finally {
    // Thêm delay để animation mượt mà
    await new Promise(resolve => setTimeout(resolve, 300));
    
    isProcessing = false;
    disableInput(false); // Hiện lại input-area với animation
    
    const imagePreviewContainer = document.querySelector(".image-preview-container");
    if (imagePreviewContainer) {
      imagePreviewContainer.remove();
    }
    uploadedImage = null;
  }
}

const uploadBtn = document.getElementById("uploadBtn");
const imageUpload = document.getElementById("imageUpload");
const textarea = document.getElementById("input");

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Thêm dòng này
  imageUpload.click();
});

imageUpload.addEventListener("change", async (e) => {
  try {
    const file = e.target.files[0];
    if (file) {
      // Xóa preview cũ trước khi xử lý ảnh mới
      const existingPreview = document.querySelector(".image-preview-container");
      if (existingPreview) {
        existingPreview.remove();
      }

      const reader = new FileReader();
      reader.onload = async () => {
        uploadedImage = reader.result.split(",")[1];

        const imagePreviewContainer = document.createElement("div");
        imagePreviewContainer.className = "image-preview-container";
        
        const imagePreview = document.createElement("img");
        imagePreview.src = reader.result;
        imagePreview.className = "image-preview";

        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "×";
        removeBtn.className = "remove-image-btn";
        removeBtn.addEventListener("click", () => {
          uploadedImage = null;
          imagePreviewContainer.remove();
          document.getElementById("send").disabled = true;
        });

        imagePreviewContainer.appendChild(imagePreview);
        imagePreviewContainer.appendChild(removeBtn);

        const inputWrapper = document.querySelector(".input-wrapper");
        inputWrapper.insertBefore(imagePreviewContainer, inputWrapper.firstChild);

        document.getElementById("send").disabled = false;
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Reset giá trị input sau khi xử lý xong
    imageUpload.value = "";
  }
});

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const welcomeSection = document.querySelector(".welcome");
    const suggestionsSection = document.querySelector(".suggestions-grid");
    if (welcomeSection) welcomeSection.remove();
    if (suggestionsSection) suggestionsSection.remove();

    const existingPreview = document.querySelector(".image-preview-container");
    if (existingPreview) {
      existingPreview.remove();
    }
    const message = e.target.value.trim();
    if (message || uploadedImage) {
      processImageAndText(message, uploadedImage);
      e.target.value = "";
      e.target.style.height = "auto";
    }
  }
});

document.getElementById("send").addEventListener("click", (e) => {
  e.preventDefault();

  const welcomeSection = document.querySelector(".welcome");
  const suggestionsSection = document.querySelector(".suggestions-grid");
  if (welcomeSection) welcomeSection.remove();
  if (suggestionsSection) suggestionsSection.remove();

  const existingPreview = document.querySelector(".image-preview-container");
  if (existingPreview) {
    existingPreview.remove();
  }
  const input = document.getElementById("input");
  const message = input.value.trim();
  if (message || uploadedImage) {
    processImageAndText(message, uploadedImage);
    input.value = "";
    input.style.height = "auto";
  }
});

const suggestions = [
  {
    icon: "fas fa-gamepad", // Icon mới
    title: "Các trò chơi dân gian phổ biến",
    content: "Giới thiệu một số trò chơi dân gian phổ biến nhất ở Việt Nam",
  },
  {
    icon: "fas fa-music",
    title: "Trò chơi dân gian dùng lời nói bài đồng dao",
    content: "Những trò chơi sử dụng bài đồng dao quen thuộc của trẻ em Việt Nam",
  },
  {
    icon: "fas fa-cube",
    title: "Trò chơi dân gian dùng dụng cụ",
    content: "Khám phá các trò chơi dân gian thú vị cần sử dụng dụng cụ",
  },
  {
    icon: "fas fa-people-group",
    title: "Đoán tên trò chơi",
    content: "Đây là trò chơi gì?",
    image: "./o_an_quan.png", // Thêm trường image
    special: true // Đánh dấu card đặc biệt
  },
];

function createSuggestionsUI() {
  const messagesArea = document.getElementById("messages");

  const welcome = document.createElement("div");
  welcome.className = "welcome";
  welcome.innerHTML = `
        <h1><strong>Xin chào! 👋</strong></h1>
        <h2>Hãy để tôi giới thiệu về các trò chơi dân gian Việt Nam.</h2>
    `;

  const suggestionsGrid = document.createElement("div");
  suggestionsGrid.className = "suggestions-grid";

  suggestions.forEach((suggestion, index) => {
    const card = document.createElement("div");
    card.className = `suggestion-card ${suggestion.special ? 'special-card' : ''}`;
    card.setAttribute("data-index", index);
    card.innerHTML = `
            <div class="icon-wrapper">
                <i class="${suggestion.icon}"></i>
            </div>
            <div class="card-content-wrapper">
              <div class="card-content">${suggestion.title}</div>
              <div class="suggestion-preview">${suggestion.content}</div>
            </div>
        `;

    // Phần xử lý click giữ nguyên
    card.addEventListener("click", () => {
      const welcomeSection = document.querySelector(".welcome");
      const suggestionsSection = document.querySelector(".suggestions-grid");
      if (welcomeSection) welcomeSection.remove();
      if (suggestionsSection) suggestionsSection.remove();
    
      // Thêm điều kiện cho card đặc biệt
      if (suggestion.special) {
        const img = new Image();
        img.src = suggestion.image;
        img.onload = () => {
          const reader = new FileReader();
          fetch(suggestion.image)
            .then(res => res.blob())
            .then(blob => {
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                processImageAndText(suggestion.content, base64data);
              }
            })
        }
      } else {
        processImageAndText(suggestion.content);
      }
    });

    suggestionsGrid.appendChild(card);
  });

  messagesArea.appendChild(welcome);
  messagesArea.appendChild(suggestionsGrid);
}

document.addEventListener("DOMContentLoaded", () => {
  createSuggestionsUI();

  const textarea = document.getElementById("input");
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && textarea.value.trim()) {
      const welcomeSection = document.querySelector(".welcome");
      const suggestionsSection = document.querySelector(".suggestions-grid");
      if (welcomeSection) welcomeSection.remove();
      if (suggestionsSection) suggestionsSection.remove();
    }
  });
});

initChat();
