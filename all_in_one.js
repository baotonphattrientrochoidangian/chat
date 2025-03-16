import { GoogleGenerativeAI } from "@google/generative-ai";

//! --- Suggestions UI ---
const suggestions = [
  {
    icon: "fas fa-gamepad",
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
    image: "./o_an_quan.png",
    special: true
  },
];

function createSuggestionsUI() {
  const messagesDiv = document.getElementById("messages");
  if (!messagesDiv) return; //! Nếu chưa có, không làm gì
  const fragment = document.createDocumentFragment();

  const welcome = document.createElement("div");
  welcome.className = "welcome";
  welcome.innerHTML = `
        <h1><strong>Xin chào! 👋</strong></h1>
        <h2>Hãy để tôi giới thiệu về các trò chơi dân gian Việt Nam.</h2>
    `;
  fragment.appendChild(welcome);

  const suggestionsGrid = document.createElement("div");
  suggestionsGrid.className = "suggestions-grid";
  suggestions.forEach((suggestion, index) => {
    const card = document.createElement("div");
    card.className = `suggestion-card${suggestion.special ? ' special-card' : ''}`;
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
    card.addEventListener("click", () => {
      const welcomeSection = document.querySelector(".welcome");
      const suggestionsSection = document.querySelector(".suggestions-grid");
      if (welcomeSection) welcomeSection.remove();
      if (suggestionsSection) suggestionsSection.remove();
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
              };
            });
        };
      } else {
        processImageAndText(suggestion.content);
      }
    });
    suggestionsGrid.appendChild(card);
  });
  fragment.appendChild(suggestionsGrid);
  messagesDiv.appendChild(fragment);
}

//! Các khai báo và cấu hình ban đầu
const apiKey = "AIzaSyDKuUZczmcIsNg8ewNnZzEBv0eNnNFgPkE";
const genAI = new GoogleGenerativeAI(apiKey);
let chatSession;
let uploadedImage = null;
const dataset = `
1. Chi chi chành chành
Giới thiệu trò chơi
Đây là trò chơi cho bé được rất nhiều trẻ em yêu thích, với cách thức chơi đơn giản, nhưng phải có được phản ứng nhanh và tinh ý. Khi chơi trò này, người tham gia nên dùng một ít kỹ xảo và đọc nhẩm theo người chơi để tránh bị bắt trúng tay nhé.
Hướng dẫn cách chơi và luật
Số lượng người chơi từ trên 3 người trở lên, sau đó chọn một người đứng ra và xòe bàn tay ra, còn những người khác sẽ giơ ngón trỏ và đặt vào lòng bàn tay của người xòe bàn tay. Sau đó người xòe bàn tay sẽ đọc to:
“Chi chi chành chành
Cái đanh thổi lửa
Con ngựa chết chương
Ba vương ngũ đế
Chấp chế đi tìm
Ù à ù ập.”
Khi người xòe bàn tay đếm đến chữ “ập” thì người xòe tay sẽ nắm tay lại, còn những người khác phải cố gắng rút tay ra thật nhanh.
Ai rút không kịp hoặc bị nắm trúng thì thua và phải làm người thay thế vào chỗ người xòe tay, sau đó người chơi này tiếp tục đọc bài đồng dao và làm cho những người khác chơi.
Có thể bạn quan tâm: Làm sao để khuyến khích trẻ chơi trò chơi giả bộ của trẻ mầm non?
<img alt="Chi chi chành chành" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-1-800x450.jpg">


2. Cướp cờ
Giới thiệu trò chơi
Đây là trò chơi không còn quá xa lạ với mọi người, trò chơi này đòi hỏi người chơi phải phản ứng và chạy nhanh. Nếu như người chơi không chạy nhanh để cướp cờ thì bạn phải chặn người cướp được cờ và giật cờ chạy về đích thật nhanh để giành chiến thắng.
Hướng dẫn cách chơi và luật
Đầu tiên, chia người chơi từ 2 đội chơi trở lên, các người chơi đứng hàng ngang ở vạch xuất phát của đội mình. Sau đó trọng tài sẽ phân các người chơi theo từng số thứ tự 1, 2, 3, 4, 5,… nên người chơi phải nhớ số chính xác của mình.
Khi trọng tài gọi tới số nào thì người chơi của số đó phải nhanh chóng chạy đến vòng và cướp cờ.
Hoặc nếu trọng tài gọi số nào về thì số đó phải về, trong quá trình gọi số, trọng tài cũng có thể gọi hai ba bốn số cùng một lúc lên tranh cướp cờ.
Trong quá trình chơi, khi đang cầm cờ mà nếu bị đối phương vỗ vào người thì người đó bị loại và ngược lại khi lấy được cờ phải chạy nhanh về vạch xuất phát của đội mình không bị đội bạn&nbsp;vỗ vào người thì người cầm cờ&nbsp;mới thắng.
Có thể bạn quan tâm: 10 Trò chơi cho bé vui đêm trung thu và gợi ý những ý tưởng tổ chức trung thu cho bé
<img alt="Trò chơi Cướp cờ" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-2-800x450.jpg">


3. Dung dăng dung dẻ
Giới thiệu trò chơi
Khi chơi trò này người chơi phải tinh ý lựa chọn sẵn cho mình một cái vòng tròn để ngồi xuống, nếu trường hợp người chơi không vào được vòng tròn nào, thì có thể lanh trí dẫn dụ người khác để mình được vào và lập tức ngồi xuống ngay nhé.&nbsp;
Hướng dẫn cách chơi và luật
Đầu tiên, người chơi vẽ sẵn các vòng tròn nhỏ trên đất, số lượng vòng tròn phải ít hơn số người chơi. Khi chơi mọi người nắm tay nhau tạo thành một hàng đi quanh các vòng tròn và cùng nhau đọc lớn:
“Dung dăng dung dè&nbsp;
Dắt trẻ đi chơi
Đi đến cổng trời gặp cậu gặp mợ
Cho cháu về quê
Cho dê đi học
Cho cóc ở nhà
Cho gà bới bếp
Ngồi xẹp xuống đây.”&nbsp;
Khi đọc hết chữ “đây” người chơi phải nhanh chóng tìm một vòng tròn và ngồi xuống. Nếu người chơi nào không tìm thấy được vòng tròn thì bị loại.
Trò chơi cứ tiếp tục như thế đến khi tìm được người thắng cuộc.
<img alt="Trò chơi Dung dăng dung dẻ" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-3-800x450.jpg">


4. Rồng rắn lên mây
Giới thiệu trò chơi
Trò chơi này quan trọng ở người đứng đầu hàng và người thầy thuốc, người đứng đầu hàng phải ngăn cản người thầy thuốc bắt được đuôi của mình, trong khi người thầy thuốc phải cố gắng bắt được đuôi của người đầu hàng. Trò chơi này đòi hỏi người chơi phải lanh lẹ và tinh mắt để tránh bị thua cuộc nhé.
Hướng dẫn cách chơi và luật
Một người đứng ra làm thầy thuốc, những người còn lại đứng thành một hàng dọc, tay người phía sau nắm vạt áo hoặc đặt tay lên vai của người phía trước. Sau đó tất cả người chơi bắt đầu vừa đi vừa hát:
“Rồng rắn lên mây
Có cây lúc lắc
Hỏi thăm thầy thuốc
Có nhà hay không?”
Sau đó, người đóng vai thầy thuốc trả lời:
“Thấy thuốc đi chơi!” (Người chơi có thể trả lời là đi chợ, đi câu cá, đi vắng nhà,…).
Đoàn người lại đi và hát tiếp cho đến khi thầy thuốc trả lời:
“Có !”
Và bắt đầu đối thoại như sau:&nbsp;
Thầy thuốc hỏi:
“Rồng rắn đi đâu?”
Người đứng làm đầu của rồng rắn trả lời:
“Rồng rắn đi lấy thuốc để chữa bệnh cho con.”
“Con lên mấy?”
“Con lên một.”
“Thuốc chẳng hay.”
“Con lên hai.”
“Thuốc chẳng hay.”
…
Cứ thế cho đến khi:
“Con lên mười.”
“Thuốc hay vậy.”
Kế đó, thì thầy thuốc đòi hỏi:
“Xin khúc đầu.”
“Những xương cùng xẩu.”
“Xin khúc giữa.”
“Những máu cùng me.”
“Xin khúc đuôi.”
“Tha hồ mà đuổi.”
Lúc này người chơi làm thầy thuốc phải tìm cách bắt cho được người cuối cùng trong hàng, và người đứng đầu phải cản lại người thầy thuốc, cố ngăn cản không cho người thầy thuốc bắt được cái đuôi (người đứng cuối hàng) của mình.
Hoặc người đứng cuối hàng phải chạy nhanh và tìm cách né tránh thầy thuốc. Nếu thầy thuốc bắt được người cuối cùng thì người đó sẽ bị loại.
<img alt="Trò chơi Rồng rắn lên mây" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-4-800x450.jpg">


5. Kéo co
Giới thiệu trò chơi
Đây là một trò chơi khá đơn giản và rất được nhiều người biết đến, hai bên phải kéo co đến khi nào một bên vượt vạch mức là thua. Trò chơi này đòi hỏi người chơi phải có thể lực, sức khỏe.
Hướng dẫn cách chơi và luật
Khi có tiếng bắt đầu của trọng tài, các đội bắt đầu túm lấy một sợi dây thừng để kéo.&nbsp;
Hai bên phải ra sức kéo, sao cho đội đối phương bước qua vạch của mình là thắng.&nbsp;
<img alt="Trò chơi Kéo co" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-5-800x450.jpg">


6. Bịt mắt bắt dê
Giới thiệu trò chơi
Một người chơi phải bịt mắt để đi bắt những người chơi còn lại. Nếu là người đi bắt, người chơi nên dùng tai nhiều hơn để xác định vị trí của các người chơi khác. Còn nếu là người trốn, người chơi phải đi nhẹ, nói khẽ để tránh việc bị người bịt mắt phát hiện và bị bắt.
Hướng dẫn cách chơi và luật
Một người bịt mắt lại bằng một chiếc khăn, những người còn lại đứng thành vòng tròn quanh người bị bịt mắt.
Sau đó, người bị bịt mắt bắt đầu di chuyển tìm kiếm mọi nơi để bắt người chơi, người chơi phải cố tránh để không bị bắt và có thể tạo ra nhiều tiếng động khác để đánh lạc hướng người bịt mắt.
Đến khi người bịt mắt bắt được người chơi thì người chơi đó sẽ bị thua.
<img alt="Trò chơi Bịt mắt bắt dê" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-6-800x450.jpg">


7. Đua thuyền trên cạn
Giới thiệu trò chơi
Các thuyền phải được dùng cơ thể của người chơi tạo thành, người chơi phải dùng hai tay và hai chân để chèo thuyền về phía trước. Trò chơi này đòi hỏi người chơi phải đoàn kết, có sức khỏe và lực cánh tay tốt.
Hướng dẫn cách chơi và luật
Trò chơi này có thể chia thành nhiều đội chơi khác nhau, mỗi đội chơi phải có số lượng người chơi bằng nhau.
Các người chơi ngồi thành hàng dọc theo từng đội, người chơi ngồi sau cặp chân vào vòng bụng của người trước để tạo thành một chiếc thuyền đua. Khi nghe hiệu lệnh của trọng tài, tất cả các thuyền đua dùng sức bằng hai chân và hai tay di chuyển cơ thể nhanh chóng để tiến về phía trước cho đến đích. Đội nào đến đích trước sẽ giành chiến thắng.
<img alt="Trò chơi Đua thuyền trên cạn" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-7-800x450.jpg">


8. Thả chó
Giới thiệu trò chơi
Người chơi ông chủ phải nhanh tay bắt được một người chơi khác để làm chú chó, chú chó phải lanh tay lẹ mắt để ý người chơi khác di chuyển có đúng luật hay không để bắt lại. Và sau cùng là các con thỏ phải nhanh nhẹn, chạy thật nhanh đến đồ vật và về lại ông chủ trong thời gian ngắn. Trò chơi này gắn kết 3 nhân vật chơi lại với nhau, tạo nên sự thú vị và vui nhộn.
Hướng dẫn cách chơi và luật
Các người chơi phân ra một nhân vật đóng vai ông chủ. Sau đó tất cả mọi người cùng hát:&nbsp;
“Ve ve chùm chùm
Cá bóng nổi lửa
Ba con lửa chết trôi&nbsp;
Ba con voi thượng đế
Ba con dế đi tìm
Ù a ù ịch.”
Sau đó, người làm ông chủ xòe ngửa bàn tay phải, người chơi khác tập trung thành một vòng tròn xung quanh ông chủ và lấy ngón tay trái của mình đặt vào lòng bàn tay của ông chủ khi nghe hát đến câu “ù a ù ịch” thì mọi người phải nhanh chóng rút tay ra và nhân vật ông chủ sẽ nắm tay lại.
Người chơi nào bị ông chủ nắm được ngón tay, sẽ đóng vai chú chó, các người chơi còn lại sẽ làm thỏ.
Sau đó, khi ông chủ diễn tả một vật nào đó thì các chú thỏ lập tức phải chạy nhanh tới chạm vào vật đó trước khoảng thời gian ông chủ sẽ thả chó.
Trong quá trình chạy về, nếu thấy chú chó xuất hiện thì các con thỏ phải đi về ở tư thế 2 tay nắm lỗ tai.
<img alt="Trò chơi Thả chó" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-8-800x450-1.jpg">


9. Chùm nụm
Giới thiệu trò chơi
Trò chơi này dựa vào yếu tố “hên xui” nhiều hơn, người chơi có thể dùng tay hoặc chân để chơi. Nếu người chơi bị loại trước một cánh tay/chân, thì hãy cố giữ lại cánh tay/chân còn lại để tiếp tục và đếm trước các cánh tay/chân còn lại để khi đọc đồng dao được biết trước nhé.
Hướng dẫn cách chơi và luật
Tất cả người chơi cùng hát:
“Chùm nụm chùm nẹo
Tay tí tay tiên
Đồng tiền chiếc đũa
Hạt lúa ba bông
Ăn trộm ăn cắp
Trứng gà trứng vịt
Bù xe bù xít
Con rắn con rít
Nó rít tay này.”
Đến từ “này” cuối cùng, trúng tay ai thì người đó phải rút nắm tay ra, sau đó trò chơi cứ thế tiếp tục. Nếu hết các nắm tay thì trò chơi kết thúc và ai trụ lại cuối cùng sẽ là người chiến thắng.
<img alt="Thả chó Chùm nụm" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-9-800x450-1.jpg">


10. Đúc cây dừa, chừa cây mỏng
Giới thiệu trò chơi
Trò chơi này vừa đếm vừa hát ca dao cũng gần giống với trò chơi Chùm nụm, tuy nhiên, trò chơi này người chơi phải thụt được 2 chân vào để làm người chiến thắng. Và người thua nên chạy thật nhanh để đuổi bắt người thắng, cả 2 người thắng và thua nên lanh lẹ để tránh đối phương hoặc bắt được đối phương.
Hướng dẫn cách chơi và luật
Tất cả người chơi ngồi xếp hàng, hai chân duỗi thẳng ra phía trước, người ở đầu hàng đếm chuyền xuống đến người ở cuối hàng và tiếp tục người ở cuối hàng đếm chuyền đến người ở đầu hàng.&nbsp;
Vừa đếm vừa hát bài ca dân gian như:
“Đúc cây dừa
Chừa cây mỏng
Cây bình đỏng (đóng)
Cây bí đao
Cây nào cao
Cây nào thấp
Chập chùng mồng tơi chín đỏ
Con thỏ nhảy qua
Bà già ứ ự
Chùm rụm chùm rịu (rạ)
Mà ra chân này.”
Khi đọc hết câu “mà ra chân này”, tới chân người nào, thì người đó sẽ phải thụt chân vào, người nào thụt hết hai chân thì thua, người nào chưa thụt chân nào thì thắng.
<img alt="Trò chơi Đúc cây dừa, chừa cây mỏng" src="https://cdn.tgdd.vn//GameApp/-1//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-10-800x450-1.jpg">


11. Chơi chuyền
Giới thiệu trò chơi
Đâu là trò chơi rất được các bé gái ưa chuộng, người chơi phải nhanh tay, nhanh mắt để bắt được que và quả bóng nhanh chóng. Trong quá trình chơi, người chơi nên ghi nhớ số lượng que của mỗi màn để tránh bắt nhầm và mất lượt nhé.
Hướng dẫn cách chơi và luật
Người chơi chuẩn bị dụng cụ gồm có 10 que đũa và một quả bóng nhỏ.
Sau đó, người chơi cầm quả bóng và tung lên không trung, đồng thời lúc này người chơi cũng nhặt từng que đũa lên. Trò chơi cứ lặp lại cho đến khi quả bóng rơi xuống đất là mất lượt.&nbsp;
Trong quá trình chơi, người chơi bắt đầu chơi từ màng 1 (lấy một que một lần tung)
Sau đó đến màng 2 (lấy hai que một lần),... cứ tiếp tục tung lên cho đến khi đủ 10 que.
Khi người chơi không nhanh tay hay nhanh mắt để bắt được bóng và que cùng một lúc sẽ bị mất lượt, lượt chơi đó sẽ chuyển sang người bên cạnh.
<img alt="Trò chơi Chơi chuyền" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-11-800x450.jpg">


12. Nhảy bao bố
Giới thiệu trò chơi
Trò chơi này đòi hỏi người chơi phải có thể lực, nhanh chân chạy thật nhanh khi đến lượt mình và cố gắng vượt qua đội khác. Vì là trò chơi đồng đội nên mỗi người phải cố gắng hoàn thành lượt chơi của mình nhanh nhất có thể nhé.
Hướng dẫn cách chơi và luật
Tất cả người chơi chia thành nhiều đội chơi có số lượng bằng nhau, mỗi đội có một ô hàng dọc để nhảy và có hai lằn mức là một mức xuất phát và một mức về đích.&nbsp;
Người đứng đầu bước vào trong bao bố, sau khi nghe lệnh xuất phát mới bắt đầu nhảy nhanh đến đích, tiếp đó sẽ đến người thứ 2 nhảy, người thứ 3,... cho đến hết người chơi. Đội nào về trước đội đó thắng.
Trong quá trình chơi, người chơi nào nhảy trước hiệu lệnh xuất phát là phạm luật, người nhảy chưa đến mức quy định hoặc nhảy chưa đến đích mà bỏ bao ra cũng phạm luật.
<img alt="Trò chơi Nhảy bao bố" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-12-800x450.jpg">


13.Ô ăn quan
Giới thiệu trò chơi
Người chơi phải nhanh tay ăn hết quan (sỏi) của người chơi khác một cách nhanh chóng. Trò chơi này người chơi nên tính toán trước các quan (sỏi) để được thắng nhanh nhất.
Hướng dẫn cách chơi và luật
Người chơi vẽ một hình chữ nhật được chia đôi theo chiều dài và ngăn thành 5 hàng dọc cách khoảng đều nhau, để có được 10 ô vuông nhỏ.&nbsp;
Sau đó, hai người chơi đi hai bên, người thứ nhất đi quan với nắm sỏi trong ô vuông nhỏ, các sỏi được rải đều xung quanh từng viên một, khi đến hòn sỏi cuối cùng người chơi vẫn đi ô bên cạnh và cứ thế tiếp tục đi quan (bỏ những viên sỏi nhỏ vào từng ô liên tục). Vậy là những viên sỏi đó đã thuộc về người chơi đó, lúc này người đối diện mới được bắt đầu.
Đến lượt đối phương đi quan cũng như người đầu tiên, cả hai thay phiên nhau đi quan cho đến khi nào nhặt được phần ô quan lớn và lấy được hết phần của đối phương. Phân thắng thua theo số lượng của các viên sỏi.
<img alt="Trò chơi Ô ăn quan" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-13-800x450.jpg">


14. Cướp cầu
Giới thiệu trò chơi
Trò tung cầu, cướp cầu là một trò chơi mang tính đặc trưng ở nhiều lễ hội. Với trò chơi này, người chơi phải nhanh nhẹn tranh giành lấy cầu để ném vào rổ hoặc truyền cho đồng đội của mình.
Trò chơi này mang tính đồng đội rất cao, nên người chơi phải phối hợp nhịp nhàng với nhau trong suốt quá trình chơi.
Hướng dẫn cách chơi và luật
Khi quả cầu được trọng tài tung ra sân. Các nhóm người chơi phải tranh cướp quyết liệt để giành quả cầu. Và người chơi cùng mỗi đội phải tranh cướp cầu của đội khác và truyền ngay cho các thành viên trong đội của mình.
Mỗi đội cướp cầu phải nhanh chóng ném vào điểm đích (rổ) của đội mình. Đội nào cướp được cầu và ném vào rổ của đội mình nhiều nhất là đội thắng cuộc.&nbsp;
<img alt="Trò chơi Cướp cầu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-14-800x450.jpg">


15. Oẳn tù tì
Giới thiệu trò chơi
Trò chơi này vô cùng đơn giản, không đòi hỏi phải dùng nhiều kỹ thuật hay dụng cụ gì nhiều, người chơi chỉ cần tinh ý và sử dụng một chút kỹ xảo nhỏ để biết trước người chơi khác ra cái gì, từ đó có thể suy tính nên sử dụng cái gì để thắng.
Hướng dẫn cách chơi và luật
Các người chơi ra một trong ba kiểu như sau:
Búa: Người chơi phải nắm các ngón tay lại như quả đấm.
Kéo: Người chơi phải nắm 3 ngón tay lại (gồm ngón cái, ngón áp út, và ngón út) và xòe ra 2 ngón tay còn lại (gồm ngón trỏ và ngón giữa).
Bao: Người chơi chỉ cần xòe cả 5 ngón tay ra.
Trong quá trình chơi, nếu muốn thắng, người chơi nên ghi nhớ “búa thì đập được kéo, kéo thì cắt được bao, bao thì bao được búa.”
Khi tất cả người chơi cùng đọc: “Oẳn tù tì, ra cái gì? ra cái này”, sau đó tất cả người chơi đưa tay ra cùng một lúc, sau đó phân định thắng thua theo kiểu hình thức là kéo, búa hoặc bao, khi hai bên ra một kiểu giống nhau thì được oẳn tù tì lại.
<img alt="Trò chơi Oẳn tù tì" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-15-800x450.jpg">


16. Kể chuyện
Giới thiệu trò chơi
Trò chơi này rất đơn giản, một người kể chuyện cho cả một nhóm người nghe, người kể chuyện nên kể những câu chuyện thú vị, kịch tính và lôi cuốn để thu hút người nghe. Cứ vậy xoay vòng, đến lượt người nào thì người đó kể chuyện.
Hướng dẫn cách chơi và luật
Một người tiên phong làm người kể chuyện, kể các sự tích, câu chuyện dân gian nào đó để mọi người cùng nghe.
<img alt="Trò chơi Kể chuyện" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-16-800x450.jpg">


17. Hội vật làng Hà
Giới thiệu trò chơi
Hội vật làng Hà là một trò chơi truyền thống được diễn ra vào mỗi năm, trong trò chơi này, hai người chơi phải dùng sức mạnh và kỹ thuật vật ngã đối phương để giành chiến thắng.
Hướng dẫn cách chơi và luật
Các người chơi phải tranh tài quyết liệt bằng các kỹ thuật, sức mạnh để đối chiến với nhau.
Người chơi nào vật ngã đối phương xuống trước và đối phương không thể chiến đấu được nữa thì giành chiến thắng.
<img alt="Trò chơi Hội vật làng Hà" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-17-800x450.jpg">


18. Tả cáy
Giới thiệu trò chơi
Trò chơi tả cáy còn được gọi là đánh gà, đây là một trò chơi nhanh tay, lẹ mắt cho người chơi. Với hình thức chơi đơn giản và đặc biệt nên trò chơi này thường được nhiều người chơi hiện nay.
Hướng dẫn cách chơi và luật
Người chơi đào một cái lỗ to tròn cỡ hình cái bát, sau đó đặt “con gà” dưới lỗ. này, con gà có thể làm bằng chất liệu gỗ hoặc sử dụng quả bóng, đồ vật gì cũng được.
Sau đó, nhà cái cầm gậy đẩy con gà ra khỏi lỗ, nhà con thì dùng gậy đẩy gà vào lỗ. Trong quá trình chơi, nhà cái phải vừa dùng gậy đẩy gà và vừa phải để ý đỡ đòn gậy của nhà con. Nếu nhà cái trụ được lâu và không có gà lọt xuống dưới thì thắng.
<img alt="Trò chơi Tả cáy" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-18-800x450.jpg">


19. Đánh quay
Giới thiệu trò chơi
Trò chơi \"đánh quay\" hay còn gọi là \"cù quay\" (sử dụng con cù để chơi) được các người chơi nam rất ưa chuộng, với trò chơi này người chơi phải giữ được con quay của mình càng lâu càng tốt.
Hướng dẫn cách chơi và luật
Con quay được làm bằng gỗ hay các đồ vật có hình nón cụt, chân bằng sắt. Sau đó, người chơi dùng một sợi dây, quấn từ dưới lên trên rồi cầm một đầu vào con quay.
Người chơi quăng mạnh con quay xuống dưới đất cho con quay xoay tròn từng vòng, trong quá trình chơi, con quay của ai quay lâu nhất là người đó thắng.&nbsp;
<img alt="Trò chơi Đánh quay" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-19-800x450.jpg">


20. Thi thổi cơm
Giới thiệu trò chơi
Trong dịp lễ hội, một số làng ở miền Bắc và miền Trung của Việt Nam có tổ chức thi thổi cơm. Cuộc thi nấu cơm nhằm diễn lại sự tích của vị tướng Phan Tây Nhạc, một vị tướng thời vua Hùng.
Trò chơi này không chỉ được diễn ra sôi động, náo nhiệt và vui vẻ cho người chơi, mà còn rèn luyện cho mọi người nấu được cơm ăn trong điều kiện khó khăn, thiếu thốn.
Hướng dẫn cách chơi và luật
Cuộc thi thổi cơm có ba bước cho người chơi, đầu tiên là thi làm gạo, sau đó đến tạo lửa, lấy nước và cuối cùng là thổi cơm cho chín.
Trong quá trình chơi, các đội phải đi tìm kiếm các nguyên liệu để nấu cơm.
Các người chơi phải tự xay thóc, giã gạo, giần sàng, lấy lửa, lấy nước và nấu cơm.
Đội nào làm được cơm trắng tinh, thơm, dẻo và chín nhất thì là đội thắng cuộc.
<img alt="Trò chơi Thi thổi cơm" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-20-800x450.jpg">


21. Thi diều sáo
Giới thiệu trò chơi
Hàng năm ở một số nơi sẽ tổ chức cuộc thi diều sáo như hội đền Hùng ở thôn Cổ Tích, Lâm Thao, Phú Thọ. Trò chơi này thường được diễn ra vào mùa hè và được rất nhiều người hưởng ứng và tham dự.
Hướng dẫn cách chơi và luật
Trò chơi có 3 hình thức chính được phân theo tiếng kêu:&nbsp;
1. Sáo cồng: tiếng kêu vang như tiếng cồng thu quân
2. Sáo đẩu: tiếng kêu than như tiếng than thở
3. Sáo còi: tiếng kêu chói tai như tiếng còi.
Sau đó, ban giám khảo có thể chấm theo tiếng sáo, nhưng trước tiên bao giờ cũng phải xem diều của người chơi trước, nếu diều của người chơi đẹp mắt, bay bổng thì mới xem như đúng quy định.
<img alt="Trò chơi Thi diều sáo" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-21-800x450.jpg">


22. Mèo đuổi chuột
Giới thiệu trò chơi
Đây là một trò chơi thuộc kiểu tập thể rất được nhiều trẻ em yêu thích, bởi sự đơn giản và vui nhộn từ trò chơi mang lại. Người chơi là mèo phải cố gắng bắt được chuột để giành chiến thắng.
Hướng dẫn cách chơi và luật
Tất cả người đứng thành vòng tròn, cùng nắm tay và giơ cao qua đầu. Sau đó tất cả người chơi cùng hát:&nbsp;
“Mèo đuổi chuột
Mời bạn ra đây
Tay nắm chặt tay
Đứng thành vòng rộng
Chuột luồn lỗ hổng
Mèo chạy đằng sau.”
Sau đó, một người chơi được chọn làm mèo và một người chơi được chọn làm chuột sẽ đứng ở giữa vòng tròn và quay lưng vào nhau.&nbsp;
Khi mọi người hát đến câu cuối thì chuột bắt đầu chạy, mèo phải chạy đằng sau. Tuy nhiên, mèo phải chạy đúng chỗ chuột đã chạy. Mèo thắng khi mèo bắt được chuột.&nbsp;
<img alt="Trò chơi Mèo đuổi chuột" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-22-800x450.jpg">


23. Ném còn
Giới thiệu trò chơi
Đối với các dân tộc Mường, Tày, H'mông, Thái,… ném còn là trò chơi thu hút các bạn trai và gái tham gia trong các dịp lễ. Không những thế, trò chơi này cũng được nhiều người lớn tuổi thích, bởi ngoài cầu duyên, ném còn còn mang ý nghĩa ấm no, mùa màng tươi tốt cho mọi người.
Hướng dẫn cách chơi và luật
Với trò chơi này, người chơi cắm một cây tre cao, trên đỉnh tre có vòng còn. Người chơi phải ném quả còn lọt qua vòng còn trên đỉnh cột là thắng cuộc.
<img alt="Trò chơi Ném còn" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-23-800x450.jpg">


24. Thi dưa hấu
Giới thiệu trò chơi
Vào khoảng đầu tháng ba âm lịch hàng năm tại Làng Thổ Tang, Vĩnh Tường, Phú Thọ có diễn ra trò chơi thi dưa hấu. Người chơi phải chọn ra những quả dưa đẹp và tươi tốt nhất để tham gia.
Hướng dẫn cách chơi và luật
Người chơi phải hái những quả dưa đẹp nhất để tham gia và các giám khảo sẽ xét thắng thua dựa theo các tiêu chuẩn gồm: giống tốt, đẹp, già, đầy đặn, bổ ra đỏ tươi vàng lại nhiều cát.&nbsp;
Nếu dưa người chơi nào đạt đúng tiêu chuẩn trên thì là người thắng cuộc.
<img alt="Trò chơi Thi dưa hấu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-24-800x450.jpg">


25. Thi thơ
Giới thiệu trò chơi
Hàng năm nhân ngày hội đền vua Đinh, để giữ gìn nếp xưa và khuyến khích mọi người nên đi theo con đường văn học, dùi mài kinh sử, nên hội thi thơ được diễn ra và thu hút rất nhiều người đến tham gia.&nbsp;
Hướng dẫn cách chơi và luật
Chủ đề thi thơ tùy vào ban tổ chức đề ra. Thí sinh nào trúng giải thưởng sẽ được thưởng và mang vinh dự về cho bản thân.
<img alt="Trò chơi Thi thơ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-25-800x450.jpg">


26. Đánh roi múa mọc
Giới thiệu trò chơi
Trò chơi đánh roi múa mọc thường được tổ chức thi đấu vào những ngày đầu tháng giêng ở các hội lễ ở miền Bắc. Trò chơi này đòi hỏi phải có kỹ năng, sức mạnh nếu muốn giành chiến thắng.
Hướng dẫn cách chơi và luật
Roi bằng tre vót nhẵn và dẻo, đầu bịt vải đỏ, mộc cũng được sơn bằng sơn đỏ. Các người chơi đấu tay đôi với nhau. Vừa dùng roi để đánh, dùng mộc để đỡ, ai đánh trúng vào chỗ hiểm của đối phương nhiều thì thắng, với trò chơi này thường đánh trúng vào vai và sườn mới được nhiều điểm.
<img alt="Trò chơi Đánh roi múa mọc" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-26-800x450.jpg">


27. Thi thả chim
Giới thiệu trò chơi
Hàng năm trò chơi thi thả chim thường được tổ chức vào hai mùa: mùa hạ (tháng 3 - 4 âm lịch) và mùa thu (tháng 7 - 8 âm lịch).&nbsp; Trò chơi này không chỉ mang lại không khí vui vẻ và nhộn nhịp mà còn ca ngợi đức tính đoàn kết, chung thuỷ của người dân Việt Nam, nên rất thu hút rất nhiều người, nhiều nơi và mọi lứa tuổi tham gia.
Hướng dẫn cách chơi và luật
Chim phải bay đúng hướng xuất phát và về đích mới được xét giải.
<img alt="Trò chơi Thi thả chim" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-27-800x450.jpg">


28. Nhún đu
Giới thiệu trò chơi
Trong các ngày hội ở Việt Nam, các thôn làng thường trồng một vài cây đu để trai gái lên đu với nhau. Cây đu được trồng bởi bốn, sáu hay tám cây tre dài vững chắc để chịu đựng được sức nặng của hai người cùng với lực đẩy quán tính. Người chơi chỉ cần lên đu và vịn vào thân trẻ, trò chơi này cũng là một loại sinh hoạt trao đổi tình cảm của trai gái.
Hướng dẫn cách chơi và luật&nbsp;
Trong quá trình chơi, người chơi càng nhún mạnh, thì đu càng lên cao. Người chơi phải cho đu lên ngang với ngọn đu là tốt nhất và muốn chiến thắng thì phải đu càng cao càng tốt.&nbsp; Nhiều nơi còn treo giải thưởng ở ngang ngọn đu để người đu giật giải.
<img alt="Trò chơi Nhún đu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-28-800x450-1.jpg">


29. Đấu vật
Giới thiệu trò chơi
Đấu vật rất phổ biến ở nhiều hội xuân miền Bắc và miền Trung, nên trước khi hội đấu vật diễn ra, các đô vật từ khắp nơi kéo đến để tham gia rất đông đúc, náo nhiệt. Người chơi phải vận dụng các kỹ thuật và sức mạnh của mình để giành chiến thắng.
Hướng dẫn cách chơi và luật
Trong lúc thi đấu vật, các đô vật phải giằng co để bắt được lỗ hổng không phòng bị của đối phương, họ phải xông vào ôm lấy nhau. Họ lừa nhau, dùng những kỹ thuật để vật ngã đối thủ. Cả hai phòng thủ tấn công đến khi nào một bên không thể đấu được nữa mới ngừng lại.
<img alt="Trò chơi Đấu vật" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-29-800x450.jpg">

30. Vật cù
Giới thiệu trò chơi
Cả hai đội chơi phải giành và đưa được cù vào sọt (hay vào hố) của đối phương, để đưa được quả cù vào đích thì người chơi phải giành giật, tranh cướp quyết liệt, bên nào cũng tìm mọi cách nhằm cản phá đối phương đưa cù vào sọt (hố) của mình. Vì thế, hàng năm hội vật cù thường rất sôi nổi, hào hứng, cuốn hút mọi người tham gia.
Hướng dẫn cách chơi và luật
Mỗi đội phải tìm cách lừa nhau để bỏ cho được quả cù vào hố của đối phương thì là thắng cuộc.
Kết thúc cuộc chơi, đội nào có số lần đưa cù vào đích của đối phương nhiều hơn là đội thắng.
<img alt="Trò chơi Vật cù " src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-30-800x450-1.jpg">


31. Kéo cưa lừa xẻ
Giới thiệu trò chơi
Trò chơi này thường phổ biến ở các trẻ nhỏ, với lời hát đơn giản, các em nhỏ có thể vừa chơi vừa ghi nhớ các âm điệu, ngôn ngữ giúp các em đoàn kết chơi với nhau hơn và phát huy những vốn từ ngữ.
Hướng dẫn cách chơi và luật
Với trò chơi này, hai người ngồi đối diện nhau, cầm chặt tay nhau. Vừa hát vừa kéo tay và đẩy qua đẩy trông như đang cưa một khúc gỗ.
Sau đó bắt đầu hát:
“Kéo cưa lừa xẻ
Ông thợ nào khỏe
Về ăn cơm vua
Ông thợ nào thua
Về bú tí mẹ.”
Hoặc:
“Kéo cưa lừa xẻ
Làm ít ăn nhiều
Nằm đâu ngủ đấy
Nó lấy mất của
Lấy gì mà kéo.”
Mỗi lần hát một từ thì lại đẩy hoặc kéo về một lần.
<img alt="Trò chơi Kéo cưa lừa xẻ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-31-800x450.jpg">


32. Kéo chữ
Giới thiệu trò chơi
Trò chơi kéo chữ thường được chơi rất nhiều người và mỗi người chơi cầm gậy dài khoảng 1,2m có quấn giấy màu và ở trên đầu gậy thường có màu sắc rực rỡ. Sau đó, người chơi sẽ tạo thành những chữ cái có nghĩa bằng những cây gậy có sẵn.
Hướng dẫn cách chơi và luật
Tất cả người chơi được chia làm hai đội, mỗi đội có một người cầm đầu (tổng cờ tiền) và một người đứng cuối (tổng cờ hậu).
Khi bắt đầu, các người chơi di chuyển dưới sự hướng dẫn của các tổng cờ để xếp thành các chữ khác nhau. Các tổng cờ vừa dẫn quân vừa múa hát.
Đội quân theo tổng cờ để thực hiện những động tác khác nhau, để tạo ra các chữ (chữ Hán hoặc Nôm) theo ý nghĩa.
<img alt="Trò chơi Kéo chữ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-32-800x450.jpg">


33. Chơi hóp
Giới thiệu trò chơi
Chơi hóp là một trong những trò chơi trong dân gian Ninh Hòa mà được rất nhiều người ưa thích. Người chơi phải tinh ý để tính toán sao cho hòn chì của mình trúng hòn chì của người thua.
Hướng dẫn cách chơi và luật
Người chơi vẽ một hình chữ nhật, dài rộng tùy thích không cần kích thước. Sau đó, cầm một cục gạch nguyên và nửa cục gạch khác được kê sát giữa lằn mức của cạnh (hay một đầu) của hình chữ nhật.&nbsp;
Hai cục gạch này để sao cho nửa cục gạch dựng đứng (điểm tựa) và cục gạch nguyên được gác lên nửa cục gạch kia. Như vậy, thì đuôi của cục gạch nguyên chạm mặt đất, đầu đưa lên trời, chính giữa tựa trên đầu của nửa cục gạch kia tạo thành một mặt dốc để vận chuyển các đồng tiền cắc (hòn chì) khởi động. Lúc này, người chơi có được mái xuôi (mặt dốc) giống hình của một đòn bẩy.
Tiếp tục, người chơi gạch một đường thẳng kể từ đường giao tuyến của mặt dốc (của cục gạch nguyên) và mặt đất (mái xuôi) dài khoảng 5 phân và cứ cách 1 phân gạch 1 lằn mức ngang dành cho những người bị hóp mang đồng tiền cắc (hòn chì) lên đặt ở mức ngang đó.
Trước khi chơi, các người chơi nên tranh đua để được đi sau cùng bằng cách dùng đồng bạc cắc hoặc viên ngói bể đập và mài tròn đến khi có diện tích (kích thước) bằng (hay vừa) đồng tiền, mà người chơi gọi là hòn chì.&nbsp;
Người chơi cầm hòn chì thẳng đứng khảy mạnh hoặc nhẹ tùy ý xuống dốc xuôi của cục gạch, sao cho hòn chì chạy và ngã dừng gần mức càng tốt. Như vậy, người chơi có thể tranh giành đi sau cùng nhưng đừng để hòn chì lăn ra khỏi mức, bởi vậy sẽ thua.
Thi xong người chơi đi theo thứ tự, nghĩa là người nào khảy hòn chì chạy ra ngoài mức đi trước, xa mức đi kế và gần mức đi sau cùng.
Người thua cuộc thì được đi đầu tiên, khảy hòn chì xuống viên gạch (mặt xuôi) để cho nó lăn xuống mức dưới; phiên người kế tiếp cố gắng khảy hòn chì, chạy xa hơn người đi trước thì tốt, cứ như thế chúng ta thay phiên lần lượt đi, cố gắng đi xa hơn mấy người trước, đừng để hòn chì chạy ra khỏi mức phía trước, như thế sẽ bị hóp, có khi bị hóp 2, 3, 4, …
Khi chơi người chơi bắt bồ và tìm cách cứu bồ. Khi hòn chì của người chơi đối phương khảy thua đội khác, người chơi có quyền xê dịch viên gạch xéo qua góc này hoặc góc khác với mục đích là để khảy hòn chì không theo đường thẳng chính diện (trực chỉ song song với hai cạnh bên của hình chữ nhật) mà chạy xéo góc hơn người chơi đội mình.
Người thắng cuộc cầm hòn chì lên trên tay rồi vạch lằn mức ngay tâm hòn chì nằm (tức là vị trí của hòn chì năm trước khi được lượm lên tay). Người thắng cuộc có hai chân đứng ngay lằn mức gạch làm điểm với tay cầm hòn chì cố gắng sao cho hòn chì của mình trúng hòn chì của người khác. Nếu trúng chỗ chật thì không được quyền chơi nữa mà nhường người chơi kế tiếp.
Xong bàn này người chơi tiếp tục chơi bàn khác và đi theo thứ tự, người thắng cuộc đi sau cùng.
<img alt="Trò Chơi hóp" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-a33-800x450.jpg">


34. Nhảy chồng cao
Giới thiệu trò chơi
Đây là một trò chơi rất được các bé ưa thích. Trước khi chơi người chơi nên ghi nhớ 5 động tác này:
Canh búp, nở, tàn, gươm: Điển hình là một nụ hoa, dùng bàn tay để trên canh tư
Canh búp: Dùng bàn tay chụm lại
Canh nở: Dùng bàn tay chụm, nhưng để hé miệng
Canh tàn: Xòe cả lòng bàn tay
Canh gươm: Để một ngón tay thẳng đứng
Hướng dẫn cách chơi và luật
Ước định đội nào đi trước.
Đội đi trước có hai người ngồi đối diện nhau, một người thẳng một chân ra phía trước, bàn chân thẳng đứng gót chân chạm đất là canh một.
Đội đi sau nhảy qua canh một, nhà mẹ nhảy qua trước và đọc “đi canh một”, tất cả nhà con nhảy theo và lập lại câu “đi canh một” và vòng nhảy về cũng vậy, tiếp tục làm theo rồi cứ như thế bên thua chồng chân lên canh 2.
Người ngồi đối diện gác chân lên hàng tiếp tục lên canh 3 và canh 4, cứ như thế mà nhảy qua nhảy lại, đồng thời trong lúc miệng đọc canh này đến canh kia.&nbsp;
Khi làm canh tư, hai người ngồi làm chồng những bàn chân lên nhau, gót chân chạm đầu ngón chân thành một tháp cao thẳng đứng.
Sau cùng, người chơi phải đi qua sông nhỏ đến sông lớn là xong, hai người làm canh qua sông nhỏ bốn bàn chân chạm vào nhau bẹt ra hơi nhỏ để người đi bước vào cũng nói “đi canh nhỏ về canh nhỏ”.
Khi tới canh lớn, hai người làm giang chân rộng ra để bên đi bước vào đi canh lớn. Khi về canh lớn hai người làm đưa tay lên cho nhà mẹ nắm và tất cả bắt đầu vụt chạy. Khi bắt được người nào thì người đó mất lượt chơi, bắt được hết là thắng.
<img alt="Trò chơi Nhảy chồng cao" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-34-800x450.jpg">


35. Đánh trỏng
Giới thiệu trò chơi
Đánh trỏng là một trò chơi dân gian ở Ninh Hòa rất được các bạn trẻ tuổi ưa thích. Trò chơi không lệ thuộc vào số người, và các đội chơi phải đoàn kết thực hiện các bước trò chơi để được giành chiến thắng.
Hướng dẫn cách chơi và luật
Trò chơi gồm có 4 phần:
1. Phần dích đầu trỏng: Đặt đầu trỏng ngắn nằm ngang trên miệng lỗ và lấy cây dài dích sao cho đầu trỏng ngắn bay ra khỏi mức, đừng để cho bên đối phương chặn lại hay bắt được đầu trỏng là người chơi đó mất lượt và thay thế người khác đi.
2. Phần ne đầu trỏng nhỏ: Đến phần ne đầu trỏng, người thắng thường đứng sát mức, tay cầm trỏng dài để đầu trỏng ngắn nằm ngang dựa vào cùm tay, người chơi đánh đầu trỏng ngắn nên đánh thật mạnh ra ngoài để bên thua không bắt được.
3. Chặt đầu mào: Người chơi đặt đầu mào nằm xuôi xuống lỗ sao cho để một đầu chỏng lên, nên đánh ra ngoài mức để sao cho đối phương đánh bắt không được thì mới tính điểm.
4. Phần u: Bên nào đánh thắng trước điểm đã giao kèo thì u bên thua, tùy theo người chơi để bắt cặp người thắng, người thua. Nếu bên thắng bắt đầu khắc bao nhiêu cái thì nhảy bao nhiêu bước khi u.
Người thắng một tay cầm cây trỏng dài cho đầu trỏng ngắn bay đi thật xa, người thua lượm đầu trỏng ngắn cầm trên tay, người thắng bắt đầu nhảy từ vị trí đầu trỏng ngắn rớt xuống, nhảy bao nhiêu bước tùy thuộc vào khắc bao nhiêu cái ở trên.&nbsp;
Khi nhảy xong rồi đặt cây trỏng dài xuống để cho người thua chơi, nếu trúng cây trỏng dài, thì người thua u một hơi dài về lỗ, người ăn chạy theo sau cầm cây trỏng dài đợi khi người thua tắt hơi để đánh người thua, rồi tiếp tục cặp khác u.&nbsp;
<img alt="Trò chơi Đánh trỏng" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-35-800x450.jpg">


36. Đánh banh thẻ
Giới thiệu trò chơi
Người chơi phải kết hợp cả tay và mắt cho thật hài hòa để tung hứng banh thẻ, tránh để mất lượt hoặc làm hỏng thẻ, bởi vậy rất có thể người chơi khác sẽ giành chiến thắng trong lượt của người đó.
Hướng dẫn cách chơi và luật
Đầu tiên, người chơi đánh thẻ bắt đầu rải đều 10 cây thẻ xuống, nên rải các thẻ đều, tránh cho thẻ bị chồng nhau.
Sau đó người chơi tung banh lên, tay cầm banh phải nhanh chóng nhặt từng thẻ, khi trái banh rớt xuống nền nhà và tung lên, thì tay phải của người chơi phải bắt kịp trái banh, không để banh rơi xuống đất. Người chơi cứ thao tác như thế cho hết số thẻ và trong quá trình chơi không được sang tay bên kia.
Người chơi làm liên tục như thế đủ 10 thẻ, không bị rơi banh hoặc bắt sai thẻ lần nào thì thắng, nếu làm sai thì chuyển lượt cho người chơi khác.
<img alt="Trò chơi Đánh banh thẻ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-36-800x450.jpg">


37. Xé giấy
Giới thiệu trò chơi
Trò chơi xé giấy rất đơn giản nên được các nhiều người ưa thích, trò này giúp mọi người&nbsp;rèn luyện sự ăn ý trong các thành viên với nhau.
Hướng dẫn cách chơi và luật
Mỗi đội lần lượt cử hai người chơi lên thực hiện. Hai người chơi đứng xoay lưng lại với nhau.
Sau đó, hai người chơi cầm 2 miếng giấy, trong đó đó một trong hai người sẽ ra lệnh cho người kia gấp giấy rồi xé. Trong quá trình chơi, người nào có số đôi (giấy xé giống nhau) nhiều là người đó thắng.
<img alt="Trò chơi Xé giấy" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-37-800x450.jpg">


38. Hú chuột
Giới thiệu trò chơi
Khi còn nhỏ sau mỗi lần được mẹ nhổ răng ra, mẹ thường ném cái răng vừa nhổ lên mái nhà hoặc gầm giường ngay lúc đó và hú chuột để cho răng mọc đẹp, đều và nhanh hơn. Đây là một truyền thống của các phụ huynh thường được sử dụng của dân tộc ta.
Hướng dẫn cách chơi và luật
Người thực hiện vừa nhổ răng xong, sau đó đọc bài đồng dao sau:
“Chi chi chuột chuột
Hú chuột răng mới về tao răng cũ về mày
Răng tao sao răng mày vậy.”
Người xưa thường nói làm như thế để cho răng được mọc đều, mọc nhanh và đẹp hơn.
<img alt="Trò chơi Hú chuột" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-38-800x450.jpg">


39. Hát sinh
Giới thiệu trò chơi
Truyền thống hát sinh được bắt nguồn từ người Cao Lan, hát sinh thường được các nam nữ thanh niên sử dụng với người mình mến mộ. Hát sinh có nội dung phong phú, tươi sáng để ca ngợi tình yêu lứa đôi, tình đoàn kết, tình yêu quê hương tổ quốc.
Hướng dẫn cách chơi và luật
Người Cao Lan thường hát những bài như sau (tạm dịch):
“Quả ớt dù cay cũng ăn cả vỏ
Quả chuối dù ngọt cũng bỏ vỏ ngoài”.
Và họ tự hào:
“Thơ ca của vị chúa thơ ca làm ra
Hát ba mươi sáu ngày đêm chưa hết”.
“Giọng hát nàng trong như tiếng chim
Nhớ mãi câu hát của nàng
Ngày mưa đội chung nón
Ngày nắng che chung ô…”.
<img alt="Trò chơi Hát sinh" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-39-800x450.jpg">


40. Hát soong
Giới thiệu trò chơi
Hát soong là một thể loại dân ca của đồng bào dân tộc Sán Dìu. Hát soong chủ yếu được hát theo hình thức đối đáp. Hát soong thường được lên kế hoạch sẵn và được tạo ra lời trước. Người đi hát phải thuộc các câu hát và dẫn câu hát trong sách ra để hát đố. Người đáp lại cũng vậy, phải sử dụng những câu đáp hợp tình, hợp cảnh để hát đáp câu của người trước.
Hướng dẫn cách chơi và luật
Hát soong thường được phân chia và hát như sau:
Chiều tối mọi người thường hát gọi để mời chơi, mời ngồi, mời nước, mời trầu,...
Nửa đêm khi hát mọi người thường hỏi, hỏi về quê quán, gia sự, nghề nghiệp, ý nguyện của nhau,…&nbsp;
Cuối cùng là hát chào, hát xin về, hát níu giữ nhau,... Sau đó, họ vừa hát vừa tiễn nhau ra cổng và hát hẹn hò cuộc gặp mặt tới.
Trong quá trình hát, phải hát nghiêm túc, không đùa giỡn, hát đối đáp hát theo giọng ví, còn hát cộc là hát kiểu kể lể. Trong các đám cưới, thường được hát ru. Người hát ru giọng phải ru dài ra, nếu một từ hát cộc kể ra rồi bắt ngay sang từ khác nhưng hát ru thì ru đi ru lại ngân nga luyến láy điệp khúc kéo dài gấp dăm bảy lần hát cộc.&nbsp;
<img alt="Trò chơi Hát soong" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-40-800x450.jpg">


41. Trống quân Đức Bác
Giới thiệu trò chơi
Trò chơi trống quân Đức Bác được Làng Cả sáng tác nên, vào mỗi năm, làng sẽ mở tiệc khai xuân cầu đinh và trò chơi sẽ được diễn ra vào ngày này. Trò chơi ngoài trời này thường được nam thanh nữ tú của dân làng đền Đức Ông và đền Đức Bà tham gia.
Hướng dẫn cách chơi và luật
Đầu tiên, các chàng trai vừa gõ trống vừa hát:
“Đón chào từ sớm tới giờ
Để cho tin đợi, tin chờ, tin mong
Hát đế:
Kìa hỡi í a trống quân
Các cô liền đáp:
Chờ mong xin giữ ơn lòng
Cách sông cách đồng giờ mới tới đây.”
Hát đế:
“Kìa hỡi í a trống quân…”
Cứ như thế hai bên đối đáp lời qua lời lại. Lời ca đối đáp thường mộc mạc nhưng chứa đầy tình ý mặn nồng.
<img alt="Trò chơi Trống quân Đức Bác" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-41-800x450.jpg">


42. Kéo song Hương Canh
Giới thiệu trò chơi
Hàng năm, làng Hương Canh (Bình Xuyên) thường tổ chức kéo song, kéo song thường thu hút được rất nhiều người tham gia. Những người chơi dùng sức để kéo những dây song. Trò chơi này mang tính tập thể rất cao, nên các thành viên của mỗi đội nên có sự chuẩn bị trước khi thi đấu.
Hướng dẫn cách chơi và luật
Số lượng thành viên đội chơi thường bằng nhau, mỗi người chơi được bịt đầu bằng khăn đỏ, lưng thắt bao đỏ.
Dây song của mỗi bên có buộc một dải màu đỏ để đánh dấu. Trong quá trình chơi, nếu bị đội đối phương lôi mạnh chỗ đánh dấu chui vào lỗ cọc thì thua. Ngược lại, nếu đội nào kéo mạnh được đội đối phương vào lỗ cọc thì thắng.
Trò chơi được diễn ra khoảng được 4 hiệp, mỗi hiệp được nghỉ giải lao 30 phút.
<img alt="Trò chơi Kéo song Hương Canh" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-42-800x450.jpg">


43. Leo cầu ùm
Giới thiệu trò chơi
Trò chơi này được bắt nguồn ở Bình Dương (Vĩnh Tường), Xuân Hoà (Lập Thạch), Đạo Đức (Bình Xuyên). Cầu ùm được dựng bằng một cây tre gác lên bờ ao và được chôn cọc xuống dưới giúp cố định hai bên, đầu ngọn được cột cố định bằng dây thừng. Người chơi khi chơi trò này thường bị ngã “ùm” xuống ao vì thế gọi trò chơi này là trò leo cầu ùm.
Hướng dẫn cách chơi và luật
Người chơi di chuyển lên cầu, giữ thăng bằng để tránh té ngã, sau đó người chơi phải di chuyển đến đầu cầu có cắm cờ để lấy lá cờ về là thắng.&nbsp;
<img alt="Trò chơi Leo cầu ùm" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-43-800x450.jpg">


44. Đả cầu cướp phết
Giới thiệu trò chơi
Trò chơi đả cầu cướp phết được diễn ra hàng năm tại đền Đông Lai, xã Bàn Giản, huyện Lập Thạch, trò chơi này thu hút được rất nhiều người đến tham gia, bởi những người này tin rằng, trong dịp đầu năm mới nếu ai sờ được quả cầu thì sẽ gặp nhiều may mắn, thuận lợi trong năm tới.
Hướng dẫn cách chơi và luật
Tất cả mọi người đợi quả cầu được tung ra khi xong nghi thức làm lễ, đến khi quả cầu được tung ra thì tất cả mọi người diễn ra cuộc tranh cướp cầu. Người nào giành được quả cầu là giành được chiến thắng.
<img alt="Trò chơi Đả cầu cướp phết" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-44-800x450.jpg">


45. Tứ thú nhân lương
Giới thiệu trò chơi
Tứ thú nhân lương thường được tổ chức tại 3 làng Mậu Lâm, Mậu Thông, Vĩnh Thịnh, trò chơi này còn có tên là “Lễ khai xuân khánh hạ” (tạm dịch: vui mừng đón xuân). Thường được người xưa gọi là múa Mo – một hình thức Các-na-van độc đáo ít thấy ở vùng quê khác. Trò này thường rất náo nhiệt và thu hút nhiều người xem và tham gia bởi không chỉ không khí vui nhộn mà còn được xem lại những vở kịch thời xưa đặc sắc.
Hướng dẫn cách chơi và luật
Trò này được diễn ra có số lượng người dựa theo mỗi vở kịch, ví dụ trong một vở kịch các thành viên lần lượt có 1 người cầm chiêng, 1 người cầm trống, 4 người vác bảng, 1 người làm sư, 1&nbsp;người làm vãi, 1 người làm thầy đồ, 1 người làm học trò, 1 người làm người cày, 1 người làm cuốc, 1 người làm cấy, 1 người làm gặt, 1 người làm xúc tôm, 1 người làm câu ếch, 1 người làm thợ mộc, 1 người làm lái buôn.&nbsp;
Sau đó, trong quá trình biểu diễn, các nhân vật đều đeo mặt nạ, và mặc y phục theo màu sắc và phong cách tuỳ từng nghề nghiệp.&nbsp;
Nhân vật nam đóng giả nhân vật nữ, và những nhân vật làm trâu hoặc bò thì chỉ có phần đầu.&nbsp;
Các nhóm người biểu diễn những vở kịch thời xưa, như: Thầy đồ dạy học, nông phu cấy cày, xúc tép, câu ếch; thương nhân đi buôn; thợ mộc đục bào,...
<img alt="Trò chơi Tứ thú nhân lương" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-45-800x450.jpg">


46. Ném lon
Giới thiệu trò chơi
Đây là một trò chơi đơn giản được rất nhiều trẻ em yêu thích, khi ném lon, người chơi nên vận dụng lực và kỹ năng để cho lon ngã, tránh chạm mức hoặc ném quá nhẹ không tới gần được lon.
Hướng dẫn cách chơi và luật
Người chơi nên chuẩn bị 1 hoặc nhiều cái lon tùy theo sở thích, các lon sẽ được xếp theo hình ngang, hình vuông, hình tháp tùy theo nhu cầu của người chơi.
Sau đó, người chơi kẻ một đường mức cách dãy lon một khoảng cố định. Sau đó các người chơi đứng ở vạch mức ném banh đến lon.
Đội chơi nào ném hết số banh và có số lon ngã nhiều hơn là thắng.
Trong quá trình chơi, người chơi đứng qua vạch mức để ném banh là không được tính lượt đó.
<img alt="Trò chơi Ném lon" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-46-800x450.jpg">


47. Đánh quân
Giới thiệu trò chơi
Trò chơi đánh quân thường được tổ chức ở nhiều nơi khác nhau như: Làng Tuân Lộ Phù Chính (Tuân Chính, Vĩnh Tường), xã Lý Nhân (Vĩnh Tường), xã Liên Châu (Yên Lạc).
Riêng ở làng Yên Thư (Yên Phương, Yên Lạc), trò chơi đánh quân lại có nguồn gốc từ “Mục đồng đánh quân” và “Chợ mục đồng”. Đây là hai hình thức vừa chơi vừa tập trận tương truyền do vua
Đinh Tiên Hoàng hướng dẫn khi qua đây đánh dẹp sứ quân của Nguyễn Khoan. Trò chơi này người chơi chỉ cần dùng sức mạnh và kỹ thuật để quật ngã đối phương xuống là được.
Hướng dẫn cách chơi và luật
Các người chơi chia làm hai nhóm, mỗi nhóm cầm sào, cầm gậy để đánh nhau, bên nào có người chơi ngã trước và ngã nhiều nhất là thua.&nbsp;
Có thể bạn quan tâm: Những hoạt động vui chơi giúp bé phát triển trí não

48. Hò dô ta
Giới thiệu trò chơi
Trò chơi này rất đơn giản, người chơi chỉ cần thực hiện động tác theo yêu cầu của trọng tài và mọi người cùng hò theo, trò chơi Hò dô ta mang lại cảm giác tươi vui, tràn đầy sức sống của các thanh thiếu niên.
Hướng dẫn cách chơi và luật
Hò theo trọng tài và làm động tác chèo thuyền.
Khi trọng tài hò: “Đèo cao”
Người chơi đáp: “Dô ta”
Trọng tài: “Thì mặc đèo cao”
Người chơi: “Dô ta”
Trọng tài: “Nhưng đèo quá cao”
Người chơi: ”Thì ta đi vòng nào”
Người chơi: “Dô hò là hò dô ta”Lưu ý :
Thay lời của câu hò cho vui, như: “Đường xa, thì mặc đường xa, nhưng đường xa quá, thì ta đi tàu” hoặc “Bài khó, thì mặc bài khó, nhưng bài khó quá thì ta hỏi thầy cô...”
Có thể bạn quan tâm: Mách ba mẹ 18 cách làm đồ chơi từ lõi giấy vệ sinh an toàn cho bé

49. Vây lưới bắt cá
Giới thiệu trò chơi
Trò chơi này có thể tổ chức cho mọi đối tượng, tuy nhiên, tùy theo đặc điểm của từng lứa tuổi mà người chơi sử dụng nhiều hoặc ít cá, với trò chơi Vây lưới bắt cá, các người chơi chỉ cần nhanh tay để bắt được nhiều cá.
Hướng dẫn cách chơi và luật
Mỗi đội chơi đứng thành một hàng dọc sau vạch xuất phát. Khi có lệnh xuất phát của trọng tài trên sân. Người chơi đứng đầu hàng chạy nhanh đến ao cá bắt lấy một con cá của đội mình theo màu đã được trọng tài quy định trước. Ngoài ra, mỗi đội có màu cá là khác nhau.
Sau khi bắt được cá, người chơi mang cá chạy nhanh đến vị trí đặt rổ đựng cá của mình và bỏ cá vào rổ đựng cá. Sau đó, người chơi chạy thật nhanh về đích.
Sau đó đến lượt người chơi thứ hai cũng thực hiện như vậy và đến hết người chơi cuối cùng thì người chơi đó có quyền bắt màu cá chung và lúc này, người chơi còn có thể bắt cả cá của đôi đối phương.
Trong lúc này, người chơi muốn bắt bao nhiêu con cá cũng được, nhưng chỉ được phép bắt một tay.
Đội thắng cuộc là đội không vi phạm luật chơi và bắt được nhiều cá có màu được quy định và cá của đội đối phương.
<img alt="Trò chơi Vây lưới bắt cá" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-49-800x450.jpg">


50. Cá sấu lên bờ
Giới thiệu trò chơi
Người chơi phải chạy nhanh chóng tìm bờ để trước khi bị bắt. Nếu là người thua, người chơi phải xác định một người chơi nào chưa tìm được bờ và nhanh chóng bắt người đó lại thay thế cho mình.
Trò chơi này đòi hỏi người chơi phải tinh ý và nhanh nhẹn để trở thành người thắng cuộc.
Hướng dẫn cách chơi và luật
Một người chơi sẽ làm cá sấu di chuyển dưới nước, những người chơi còn lại chia nhau đứng trên bờ, sau đó các người chơi chọc tức cá sấu bằng cách đợi cá sấu ở xa thì thò một chân xuống nước hoặc nhảy xuống nước và vỗ tay hát “Cá sấu, cá sấu lên bờ”. Khi nào cá sấu chạy đến bắt thì phải nhảy ngay lên bờ.
Người chơi nào nhảy lên bờ không kịp bị cá sấu bắt được thì thua và phải thay làm cá sấu.&nbsp;
<img alt="Trò chơi Cá sấu lên bờ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-50-800x450.jpg">


51. Keng trái cây
Giới thiệu trò chơi
Người chơi phải suy nghĩ các loại trái cây có sẵn trong nước, trong quá trình chơi nên lắng nghe người chơi khác hô tên trái cây gì để biết tránh ra và không gọi tên trái cây đó.
Hướng dẫn cách chơi và luật
Khi chơi, một người chơi sẽ đi bắt những người còn lại. Người chơi muốn tránh người bắt thì phải hô tên của một loại trái cây bất kỳ, và đứng yên tại chỗ, sau đó người chơi chỉ được di chuyển khi có người khác đến cứu và tiếp tục trò chơi.
Trong quá trình chơi, người chơi không được hô tên của loại trái cây mà người trước đã hô và chỉ gọi tên những trái cây trong nước, không được lấy tên trái cây nhập khẩu quốc tế (như me Thái, mận Ấn Độ,…).
Và khi người chơi đã hô tên trái cây mà di chuyển là bị mất lượt.
<img alt="Trò chơi Ken trái cây" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-51-800x450.jpg">


52. Một hai ba
Giới thiệu trò chơi
Người bị thua đầu tiên nên lắng nghe tiếng bước chân di chuyển của người chơi khác để biết quay lại kịp thời, người chơi khác phải nhanh nhạy di chuyển thật nhanh và tránh bị người thua đầu tiên bắt trúng.
Hướng dẫn cách chơi và luật
Người đi bắt đầu tiên phải đứng úp mặt vào tường tại mức đích. Những người chơi còn lại phải đứng ở vạch mức xuất phát.&nbsp;
Lúc này, người đi bắt đầu tiên sẽ đọc to “Một – hai – ba”, đồng thời những người ở phía sau bước lên thật nhanh.&nbsp;
Sau tiếng “ba” kết thúc, người đi bắt sẽ quay lại, nếu lúc này thấy ai đang bước hoặc còn di chuyển thì người chơi đó bị thua và loại.
Trò chơi cứ thế diễn ra khi người chơi di chuyển đến gần người đi bắt, khi đến gần, người chơi sẽ đập vào lưng người đi bắt. Lúc này tất cả người chơi sẽ chạy thật nhanh về vạch mức ban đầu.&nbsp;
Và người đi bắt sẽ đuổi theo, người đi bắt đụng vào ai thì người đó sẽ bị thua và trở thành người đi bắt.
Trong quá trình chơi, người bị phạt phải úp mặt vào tường và hô “một – hai – ba”, sau tiếng “ba” mới được quay lại để bắt người chơi.
<img alt="Trò chơi Một hai ba" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-52-800x450.jpg">


53. Đánh đáo
Giới thiệu trò chơi
Đây là một trò chơi khá đơn giản rất được các bé gái yêu thích. Người chơi chỉ cần lựa chọn vị trí tốt để chọi trúng đáo, tránh để bị mất lượt.
Hướng dẫn cách chơi và luật
Đầu tiên, các người chơi vạch hai lằn mức cách nhau khoảng 2m. 
Sau đó, người chơi đứng ở vạch thứ hai sẽ thảy những đồng tiền vào phía trên vạch thứ nhất, đồng tiền nào rơi vào giữa hai vạch coi như loại và người đi sau có thể ăn đồng tiền này.
Sau đó, người chơi thứ hai sẽ bắt đầu và nhắm vào những đồng tiền trên mức thứ nhất, dùng đáo chọi vào những đồng tiền đó.
Nếu người chơi chọi trúng thì được “ăn” những đồng tiền đó và có quyền chọi tiếp. Nếu chọi không trúng thì phải nhường quyền chọi đáo cho người kế tiếp.
<img alt="Trò chơi Đánh đáo" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-53-800x450.jpg">


54. Nu na nu nống
Giới thiệu trò chơi
Trò chơi này không còn xa lạ với các bạn nhỏ hiện nay, với trò chơi này người chơi phải vừa đọc bài đồng dao vừa thực hiện trò chơi. Trò chơi mang lại cảm giác tươi vui, hấp dẫn nên rất thu hút được rất nhiều các bạn nhỏ chơi.
Hướng dẫn cách chơi và luật
Tất cả các người chơi ngồi xếp hàng cạnh nhau, trong lúc này các người chơi duỗi thẳng chân ra, tay cầm tay, vừa nhịp tay vào đùi vừa đọc bài đồng dao:
“Nu na nu nống
Cái cống nằm trong
Cái ong nằm ngoài
Củ khoai chấm mật
Bụt ngồi bụt khóc
Con cóc nhảy ra
Con gà ú ụ
Bà mụ thổi xôi
Nhà tôi nấu chè
Tè he chân rút.”Hoặc:
“Nu na nu nống
Cái cống nằm trong
Đá rạng đôi bên
Đá lên đá xuống
Đá ruộng bồ câu
Đá đầu con voi
Đá xoi đá xỉa
Đá nửa cành sung
Đá ung trứng gà
Đá ra đường cái
Gặp gái giữa đường
Gặp phường trống quân
Có chân thì rụt.”
Mỗi từ trong bài đồng dao được đập nhẹ vào một chân theo thứ tự từ đầu đến cuối rồi lại quay ngược lại cho đến chữ “rút” hoặc “rụt”. Chân ai gặp từ “rút” hoặc “rụt” nhịp trúng thì co chân lại. Cứ thế cho đến khi các chân co lại hết lại thì người chơi còn chân thẳng sẽ thắng.
<img alt="Trò chơi Nu na nu nống" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-54-800x450.jpg">


55. Máy bay xuất kích
Giới thiệu trò chơi
Người chơi tấn công nên có sức mạnh và hơi tốt để khi “u” được kéo dài hơn, nếu người chơi hết hơi phải chạy thật nhanh về trước đích. Trong khi tấn công, nếu có đồng đội bị bắt thì nên cứu về, sau đó mới bắt đầu tấn công đội đối phương
Hướng dẫn cách chơi và luật
Các người chơi chia ra thành hai đội, mỗi đội đứng trong khu vực của mình. Các người chơi quyết định lượt chơi bằng cách khi oẳn tù tì, bên thắng đi trước bằng cách cho một máy bay xuất kích. 
Người làm máy bay phải kêu “u” liên tục khi rời khỏi lãnh thổ của mình. Nếu hết hơi trước khi vào trong vạch coi như máy bay bị rơi và sẽ bị bắt làm tù binh. 
Máy bay muốn hạ đối phương thì phải chạm được vào đối phương, người bị hạ phải qua lãnh thổ đối phương để làm tù binh.
Trong lúc lâm chiến, bên đối phương có thể ùa ra bắt máy bay bằng cách giữ không cho máy bay về được lãnh thổ của mình, cho đến khi máy bay hết hơi không kêu “u” được nữa.
Ngược lại, nếu đối phương giữ không chặt để máy bay trốn thoát về lãnh thổ của mình thì những người giữ máy bay đều bị bắt làm tù binh. 
Tù binh được giải cứu bằng cách cố chìa tay ra để cho máy bay đội mình chạm đến được. Trong quá trình chơi, nếu nhiều tù binh bị bắt và muốn cứu được hết thì các tù binh phải nắm tay nhau lại, sau đó máy bay chỉ cần chạm vào một người là tất cả được cứu.
<img alt="Trò chơi Máy bay xuất kích" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-55-800x450-1.jpg">


56. Bong bóng nước
Giới thiệu trò chơi
Người chơi nên bắt bóng chính xác để tránh bóng rơi và bị phạt, nếu muốn thắng hoặc loại người chơi khác, thì nên chuyền bóng theo mẹo để đối phương không chụp được.
Hướng dẫn cách chơi và luật
Đầu tiên, người chơi đổ nước vào quả bong bóng, sau đó các người chơi đứng thành vòng tròn và người chơi lần lượt thảy bóng vào các người chơi đứng trong vòng tròn.
Người chơi nào được thảy bóng tới thì phải chụp chính xác.
Ai bắt không trúng bóng, làm bóng rớt thì bóng sẽ nổ và bị dính nước là thua. 
<img alt="Trò chơi Bong bóng nước" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-56-800x450.jpg">


57. Đi cà kheo
Giới thiệu trò chơi
Trò chơi này thường được chơi ở bãi biển để nếu người chơi có bị ngã thì không bị đau, trong quá trình chơi, người chơi nên kết hợp tay và chân hài hòa để di chuyển được nhanh chóng và giành chiến thắng.
Hướng dẫn cách chơi và luật
Tất cả các người chơi có thể chia làm hai đội để thi đấu với nhau (vd: thi chạy, đi nhanh,…). Cây cà kheo được làm bằng tre, và mỗi cây cà kheo có độ cao cách mặt đất khoảng 1,5m – 2m. 
Các thành viên tham gia thi đấu sẽ di chuyển trên cà kheo
Nếu ai ngã khi đang thi đấu hoặc di chuyển chậm không đến đích thì đội đó thua.
<img alt="Trò chơi Đi cà kheo" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-57-800x450.jpg">

Trò chơi Đi cà kheo
Có thể bạn quan tâm: Mách ba mẹ 12 cách làm đồ chơi từ cốc giấy siêu hay cho bé
58. Tập tầm vông
Giới thiệu trò chơi
Trò chơi này rất đơn giản, phụ thuộc nhiều vào đánh lừa người chơi khác và tinh ý xem người chơi kia giấu đồ vật ở tay nào. Nếu không biết, người chơi nên thử đoán tâm ý của người giấu và ngược lại.
Hướng dẫn cách chơi và luật
Trò chơi này rất đơn giản, các người chơi đề cử ra một người nắm giữ đồ vật (như viên sỏi, viên bi,...) trong bàn tay, người giữ có thể sử dụng tay trái hoặc tay phải để giấu. Sau đó, tất cả mọi người sẽ đọc to bài đồng dao:
“Tập tầm vông
Tay không tay có
Tập tầm vó
Tay có tay không
Tay không tay có
Tay có tay không?”
Lúc này, người giữ đồ vật sẽ đưa hai tay ra. Và những người chơi còn lại sẽ đoán xem tay nào đang giữ đồ vật.
Nếu người chơi bị đoán trúng tay nắm viên sỏi thì người chơi thắng, hoặc ngược lại những người chơi còn lại không đoán được tay nào nắm viên sỏi thì người giữ viên sỏi thắng.
<img alt="Trò chơi Tập tầm vông" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-58-800x450.jpg">


59. Nhảy dây
Giới thiệu trò chơi
Với trò chơi này, người chơi phải tính toán sợi dây để nhảy qua khi dây tới, trong quá trình nhảy người chơi nên nhảy cao lên để tránh bị vướng vào sợi dây và thua.
Hướng dẫn cách chơi và luật
Tất cả người chơi lần lượt vào vòng quay của dây để nhảy qua, các người chơi cứ tiếp tục nhảy đúng theo số lần quy định của cuộc chơi. Nếu vướng dây thì đội chơi đó sẽ bị thua.
<img alt="Trò chơi Nhảy dây" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-59-800x450.jpg">


60. Ken con vật
Giới thiệu trò chơi
Giống với trò chơi ken trái cây, trò chơi ken con vật người chơi cũng phải suy nghĩ trước các con vật có hai từ sẵn. Nếu người chơi có nguy cơ bị bắt thì nên đọc tên con vật đó lên ngay lập tức. Trong quá trình chơi, nếu muốn cứu người khác, người chơi chỉ cần chạm vào người chơi đó là được.
Hướng dẫn cách chơi và luật 
Đầu tiên, tất cả các người chơi chọn ra một người đầu tiên sẽ đứng giữa và dí bắt các người chơi khác. 
Nếu các người chơi có nguy cơ bị bắt thì có thể đứng lại và nói 2 chữ về một con vật nào đó (ví dụ: gà con, chó sói, vịt bầu, heo mọi,…), sau khi hô xong, người chơi phải đứng im không nhúc nhích, nếu muốn chơi trở lại người chơi phải chờ người khác đến cứu, muốn cứu chỉ cần người chơi khác chạm vào bạn là được.
Lúc này người đi bắt sẽ không được bắt người chơi đó và di chuyển đi bắt người khác. 
Nếu người đi bắt chạm vào người chơi nào mà người chơi đó không kịp ken thì người chơi đó sẽ bị thua và ra thay thế cho người đi bắt trước đó.
<img alt="Trò chơi Ken con vật" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-60-800x450.jpg">


61. Bún dây thun
Giới thiệu  trò chơi
Trò chơi này vô cùng đơn giản từ cách chơi đến dụng cụ chơi, người chơi chỉ cần canh chuẩn vị trí để bắn thun sao cho hai sợi dây đan vào nhau là được.
Hướng dẫn cách chơi và luật
Đầu tiên, mỗi người chơi sử dụng từ 5 đến 10 sợi dây thun rồi thảy tất cả xuống đất.
Sau đó người chơi này sẽ dùng ngón tay bún sợi dây thun của mình sao cho các sợi thun đan vào nhau.
Trong quá trình chơi, ai bún được 2 sợi thun đan vào nhau trước thì sẽ ăn được hai sợi đó. Và người nào giữ được nhiều dây thun nhất thì là người thắng cuộc.
<img alt="Trò chơi Bún dây thun" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-61-800x450.jpg">


62. Du de du dích
Giới thiệu trò chơi
Nếu là người xòe tay, người chơi nên hát câu cuối vừa xong là nắm lại lập tức để bắt tay của người chơi kia. Nếu bạn là người đưa ngón tay vào, thì nên rút tay ra thật nhanh khi nghe câu hát cuối. của người xòe tay ra.
Hướng dẫn cách chơi và luật
Đầu tiên, một người chơi sẽ xòe tay ra và hát:
“Du de – du dích – bán mít chợ đông – bán hàng chợ cũ - bán hũ nước tương”. Sau đó, người chơi thứ hai sẽ đưa 1 ngón tay vào lòng bàn tay của người chơi thứ nhất.
Khi người chơi thứ nhất hát đến chữ “tương” sẽ nắm tay lại nếu bắt trúng được ngón tay của người chơi thứ hai, xem như người chơi thứ hai sẽ bị thua.
<img alt="Trò chơi Du de du dích" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-62-800x450.jpg">


63. Thìa la thìa lảy
Giới thiệu trò chơi
Đây là một trò chơi thú vị và vui vẻ rất được nhiều bé gái ưa thích, với lối chơi đơn giản, mọi người cùng nhau hát đồng ca, giúp người chơi biết thêm những từ ngữ, ca dao mới và hòa nhập với tập thể hơn.
Hướng dẫn cách chơi và luật
Tất cả các người chơi nắm tay lại và xếp chồng lên nhau, một người chơi chủ sẽ đứng bên ngoài chỉ tới người chơi nào thì sẽ tương ứng với một nắm tay đó, khi đó tất cả cùng hát:
“Thìa là thìa lảy
Con gái bảy nghề
Ngồi lê là một
Dựa cột là hai
Theo trai là ba
An quà là bốn
Trốn việc là năm
Hay nằm là sáu
Láu táu là bảy.”
Sau khi hát đến từ “bảy” trúng tay ai thì người đó phải rút nắm tay ra. Cứ thế cho đến hết năm tay thì trò chơi chấm dứt.
<img alt="Trò chơi Thìa la thìa lảy" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-63-800x450.jpg">


64. Úp lá khoai
Giới thiệu trò chơi
Đây là một trò chơi thuộc kiểu tập thể, được nhiều trẻ em ưa thích, với lối chơi đơn giản, cả tập thể cùng hát đồng ca vui nhộn và sinh động, giúp mọi người chơi có những phút giây vui vẻ và thoải mái.
Hướng dẫn cách chơi và luật
Mỗi người chơi ngồi thành vòng tròn, úp 2 bàn tay xuống đất. Khi bắt đầu đọc “úp lá khoai” thì 1 người lấy tay của mình phủ lên tay của tất cả mọi người. Đồng thời, lúc đó mọi người ngửa hết bàn tay lên. Một người lấy tay của mình chỉ lần lượt từng bàn tay, vừa chỉ vừa hát: 
“Mười hai chong chóng
Đứa mặc áo trắng
Đứa mặc áo đen
Đứa xách lồng đèn
Đứa cầm ống thụt
Thụt ra thụt vô
Có thằng té xuống giếng
Có thằng té xuống sình
Úi chà , úi da!”
Hát đến chữ cuối cùng, người chỉ mà chỉ vào tay của người nào thì người đó bị thua.
<img alt="Trò chơi Úp lá khoai" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-64-800x450.jpg">


65. Oẳn tù tì (Đồng dao)
Giới thiệu trò chơi
Trò chơi này có lối chơi vô cùng đơn giản, người chơi chỉ cần lắng nghe giai điệu bài hát để thực hiện tư thế được chính xác là được.
Hướng dẫn cách chơi và luật 
Đầu tiên, hai người chơi sẽ đứng đối diện nhau. Sau đó tất cả cùng hát:
“Búp bê nhảy
Búp bê xoay
Nghe điện thoại
Xin chữ ký
Không biết gì.”
Khi được hát đến từ “nhảy và xoay” thì người chơi phải nhảy lên và xoay 1 vòng.
Khi hát đến từ “nghe điện thoại” thì người chơi đưa tay lên tai làm ra bộ dáng đang nghe điện thoại.
Khi hát đến từ “xin chữ ký” thì người chơi xòe bàn tay ra để làm sổ, tay còn lại làm bút và bắt đầu ghi ghi lên sổ.
Khi được hát đến từ “không biết gì” thì người chơi sẽ oẳn tù tì như bình thường.
Người chơi nào oẳn tù tì thua hoặc làm không đúng bộ dáng như vậy thì là người thua.
<img alt="Trò chơi Oẳn tù tì (Đồng dao)" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-65-800x450.jpg">


66. Tung đồng đáo
Giới thiệu trò chơi
Khi chơi trò chơi này người chơi nên canh vị trí của lỗ để có thể thả đồng xu được chính xác hơn. Đánh đáo thường được các bé trai ưa thích với lối chơi đơn giản, phụ thuộc nhiều vào tính toán và sự tinh ý.
Hướng dẫn cách chơi và luật
Người chơi dùng đồng tiền xu, sau đó khoét một lỗ tròn để có thể bỏ vừa nửa đồng xu này. Tiếp đó, người chơi vạch một vạch trên mặt đất ngay phía dưới lỗ đáo (lỗ vừa đào).
Sau đó, người chơi tiếp tục vạch một vạch ngang trên mặt đất nữa để làm chỗ cấm không được đặt chân vào lên khi chơi. Vạch này phải được song hành với vạch trên.
Tiếp theo, những người chơi góp mỗi người một số tiền rồi dùng đồng cái của mình đứng dưới vạch và thả vào lỗ. Ai thả trúng (đồng cái phải nằm lại) giữa lỗ thì người chơi đó đứng nhất và cứ theo sự gần xa của lỗ mà tính thứ tự nhì, ba, tư,... Ngoài ra, những đồng nằm dưới vạch coi như ra ngoài.
Người chơi đứng nhất sẽ được cầm tất cả số tiền, sau đó đứng dưới vạch thả vào lỗ, vào được bao nhiêu đồng thì ăn bấy nhiêu.
Còn những đồng nằm xung quanh lỗ phải qua lần thử thách mới do trọng tài đề ra. Nếu không được thì người đứng nhì nhặt những đồng tiền còn lại để đi tiếp (đi theo kiểu như người đứng nhất).
Trò chơi cứ thế tiếp tục cho đến khi tất cả đồng xu được các người chơi ăn hết mới chấm dứt.
<img alt="Trò chơi Tung đồng đáo" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-66-800x450.jpg">


67. Me me de de
Giới thiệu trò chơi
Lại một trò chơi đơn giản nữa mà tất cả mọi người đều chơi được, người chơi chỉ cần vừa hát vừa oẳn tù tì là được.
Hướng dẫn cách chơi và luật
Đầu tiên, hai người chơi sẽ ngồi đối diện nhau và vừa oẳn tù tì vừa hát:
“Me me de de
Cham bồ chát chát
Me me de de
Cham bồ chát chát.”
Người chơi nào oẳn tù tì thắng sẽ là người thắng cuộc.
<img alt="Trò chơi Me me de de" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-67-800x450.jpg">


68. Đá gà
Giới thiệu trò chơi
Trò chơi này đòi hỏi người chơi giữ được thăng bằng tốt, không những người chơi phải có thể lực để trụ tốt, mà còn phải có kỹ thuật để loại bỏ nhanh chóng những người chơi khác.
Hướng dẫn cách chơi và luật 
Đầu tiên, các người chơi gập 1 chân của mình lại, chân còn lại giữ nguyên.
Sau đó, người chơi sẽ nhảy lò cò đi đá chân của người khác.
Muốn đá được chân của người chơi khác, thì người chơi chỉ cần dùng chân gập đó đá vào chân gập của đối phương.
Trong quá trình chơi người chơi nào mà ngã trước, hoặc thả chân xuống trước thì là người thua cuộc.
<img alt="Trò chơi Đá gà" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-68-800x450.jpg">


69. Nhảy cóc
Giới thiệu trò chơi
Trò chơi này rất được nhiều bạn nhỏ ưa thích, không chỉ vui, đơn giản mà còn rèn luyện được thể lực. Khi được nhảy cóc, người chơi nên lấy đà để được nhảy xa hơn, trong quá trình chơi, tránh để tay chạm xuống đất.
Hướng dẫn cách chơi và luật
Đầu tiên, hai người chơi sẽ đứng đối diện nhau ở hai đầu sân chơi và vạch hai mức đích, một mức bắt đầu và một mức về đích. Sau đó cả hai người chơi cùng chơi oẳn tù tì để quyết định ai là người đi trước.
Người thắng được quyền nhảy cóc về phía trước 1 nhịp. Khi nhảy, người chơi chụm 2 chân lại để nhảy. 
Nhảy xong nhịp này, người chơi lại oẳn tù tì tiếp, người thắng lại được quyền nhảy cóc tiếp 1 nhịp, trò chơi cứ thế tiếp diễn cho đến khi người nào về đích trước thì sẽ là người thắng cuộc.
Người chơi khi nhảy 2 chân phải chụm lại, và người oẳn tù tì thắng có quyền nhảy cóc ngắn hoặc dài tùy theo sức của mình. Nhưng trong quá trình nhảy, người chơi nào chống (chạm) tay xuống đất trước thì coi như không được nhảy bước đó (phải trở về vị trí cũ trước khi nhảy bước đó).
<img alt="Trò chơi Nhảy cóc" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-69-800x450.jpg">


70. Đi tàu hỏa
Giới thiệu trò chơi
Trò chơi đi tàu hỏa là một trò chơi mang tính tập thể, trong quá trình chơi người chơi vừa phải thực hiện đúng động tác và vừa hát đồng dao.
Hướng dẫn cách chơi và luật
Tất cả các người chơi đứng thành một hàng dọc, người đứng sau để tay lên vai người đứng trước để tạo thành hình tàu hỏa. 
Sau đó, người dẫn đầu sẽ vừa chạy vừa hô lệnh “Tàu lên dốc” hoặc “Tàu xuống dốc”.
Khi nghe lệnh “Tàu lên dốc” tất cả người chơi sẽ chạy chậm lại, bàn chân nhón lên và được chạy bằng mũi bàn chân. 
Ngược lại, khi nghe lệnh “Tàu xuống dốc”, tất cả người chơi sẽ chạy chậm chậm lại bằng gót chân.
Đồng thời, trong lúc chạy, mọi người cùng hát bài đồng dao:
“Đi cầu đi quán
Đi bán lợn con
Đi mua cái xoong
Đem về đun nấu
Mua quả dưa hấu
Về biếu ông bà
Mua một đàn gà
Về cho ăn thóc
Mua lược chải tóc
Mua cặp cài đầu
Đi mau, về mau
Kẻo trời sắp tối.”
Cả đoàn tàu vừa chạy theo lệnh của đầu tàu vừa hát bài đồng dao. Nếu người chơi nào hát nhỏ hoặc không làm đúng động tác chạy thì sẽ bị cả tàu phạt (hình thức phạt nhẹ nhàng tùy đoàn tàu đề ra).
<img alt="Trò chơi Đi tàu hỏa" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-70-800x450.jpg">

71. Đi câu ếch
Giới thiệu trò chơi
Trò chơi đi câu ếch giống với tên gọi của nó, trong quá trình chơi, người chơi phân ra làm người đi câu và người làm ếch (bị câu). Người đi câu thì cố gắng bắt ếch, còn ếch thì cố gắng tránh xa ra cần câu của người đi câu.
Hướng dẫn cách chơi và luật
Trước khi chơi, người chơi nên chuẩn bị các dụng cụ sau: Một cái que khoảng 1m, một sợi dây khoảng 1m và một tờ giấy.
Sau đó, các người chơi sẽ vẽ một vòng tròn xuống đất để làm ao. 
Tiếp đến, các người chơi sẽ làm cần câu. Cần câu là một cây que 1m buộc với một sợi dây dài 1m và đầu sợi dây người chơi sẽ buộc thêm một miếng giấy gấp nhỏ.
Sau đó, để bắt đầu vào trò chơi thì tất cả người chơi dùng trò chơi oẳn tù tì để xem ai là người đi câu đầu tiên.
Người đi câu đầu tiên sẽ cầm cần câu và đi bên ngoài vòng tròn, các người chơi còn lại sẽ vào trong vòng tròn (trong ao) làm ếch.
Đồng thời, trong khi chơi, các người chơi vừa chơi vừa hát:
“Ếch ở dưới ao
Vừa ngớt mưa rào
Nhảy ra bì bọp
Ếch kêu ộp ộp
Ếch kêu oạp oạp
Thấy bác đi câu
Rủ nhau trốn mau
Ếch kêu ộp ộp
Ếch kêu oạp oạp.”
Trong khi hát, các người chơi sẽ làm động tác như ếch đang nhảy (tay chống nạnh, chân chụm lại và nhún xuống) và nhảy lung tung trong vòng tròn. 
Nếu thấy người đi câu còn ở xa thì người chơi có thể nhảy lên bờ (ra khỏi vòng tròn) để trêu người đi câu. 
Nhưng người chơi phải cảnh giác người đi câu, vì nếu người chơi đang ở trên bờ mà để người đi câu quăng dây trúng là sẽ bị bắt và bị loại. 
Trong quá trình chơi, người đi câu nếu không câu được con ếch nào thì người đi câu sẽ bị phạt.
<img alt="Trò chơi Đi câu ếch" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-71-800x450.jpg">


72. Cắp cua
Giới thiệu trò chơi
Với trò chơi này, khi chơi người chơi nên khéo léo và thao tác nhẹ nhàng để tránh đụng phải những viên sỏi khác. Nên giữ vững viên sỏi bạn đã cắp được vào tay, đừng để sỏi rơi ra ngoài.
Hướng dẫn cách chơi và luật 
Đầu tiên, người chơi dùng trò chơi oẳn tù tì để xác định người đi trước. Người đi trước bốc 10 viên sỏi lên thả xuống đất. Sau đó, người chơi sẽ đan và nắm mười ngón tay vào nhau, chỉ để 2 ngón duỗi thẳng ra làm càng cua.
Người chơi dùng hai ngón tay để cắp từng viên sỏi, trong lúc này, người chơi không được chạm trúng vào các viên sỏi khác. Nếu người chơi cắp được viên sỏi nào thì sẽ để các viên sỏi đó sang một bên.
Trong quá trình chơi, lượt một người chơi sẽ cắp 1 viên, lượt hai sẽ cắp 2 viên,... cứ tiếp tục như vậy cho đến khi cắp 10 viên.
Nếu người chơi khi đang cắp sỏi mà chạm vào viên khác thì phải nhường cho người kế tiếp đi.
Sau khi cắp hết 10 viên, đếm xem ai cắp được nhiều nhất thì người đó thắng.
<img alt="Trò chơi Cắp cua" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-72-800x450-1.jpg">

Trò chơi Cắp cua
Có thể bạn quan tâm: 7 cách hiệu quả để thúc đẩy sự phát triển thể chất ở trẻ em
73. Lùa vịt
Giới thiệu trò chơi
Trò chơi này không còn quá xa lạ với các bạn nhỏ, khi chơi các người chơi chỉ cần chia làm 2 trạng thái, người chơi bên trong vòng tròn cố tránh khỏi người bên ngoài vòng tròn và ngược lại, người bên ngoài vòng tròn cố gắng đập vào người bên trong vòng tròn.
Hướng dẫn cách chơi và luật
Tất cả các người chơi cử một người chơi làm nhân vật người lùa vịt, người lùa vịt đứng ở ngoài vòng tròn. Các người chơi còn lại đứng trong vòng tròn để làm vịt.
Khi bắt đầu trò chơi, người lùa vịt sẽ chạy quanh vòng tròn, tìm cách đập vào các người chơi làm vịt đứng trong vòng tròn.
Trong quá trình chơi, người lùa vịt đập trúng vào người làm vịt thì người chơi làm vịt đó sẽ bị thua và loại khỏi cuộc chơi.
<img alt="Trò chơi Lùa vịt" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-73-800x450.jpg">


74. Ném vòng
Giới thiệu trò chơi
Với trò chơi này, người chơi chỉ cần canh chuẩn xác vị trí để ném vòng lọt vào chai, trò chơi này thường thu hút được rất nhiều các đối tượng tham gia vào những dịp lễ.
Hướng dẫn cách chơi và luật
Trước khi chơi, các người chơi nên chuẩn bị những dụng cụ sau: 3 cái chai, 9 cái vòng cỡ vừa được làm bằng tre hoặc bằng nhựa (những dụng cụ này người chơi có thể chuẩn bị nhiều hay ít tùy theo sở thích).
Sau đó, các người chơi đặt 3 cái chai thành một hàng thẳng và cách nhau khoảng 50 đến 60 cm.
Tiếp theo, người chơi sẽ vẽ vạch một đường mức cách xa vị trí đặt chai một khoảng cách nhất định.
Và sau đó, các người chơi sẽ bắt đầu dùng vòng ném vào những cái chai này, người chơi nào ném vòng vào chai nhiều nhất là người thắng cuộc.
<img alt="Trò chơi Ném vòng" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-74-800x450.jpg">


75. Lựa đậu
Giới thiệu trò chơi
Trò chơi lựa đậu cũng giống như tên gọi của nó, các người chơi chỉ cần lựa đậu, đội nào lựa được nhanh và chính xác là thắng.
Hướng dẫn cách chơi và luật
Người chơi cần chuẩn bị các vật dụng để chơi, bao gồm: Đậu đen, đậu xanh, đậu đỏ, rổ đựng đậu, chén.
Sau đó, các người chơi chia thành nhiều đội chơi, số lượng thành viên mỗi đội là bằng nhau.
Sau đó, người chơi sẽ trộn chung ba loại hạt này vào cùng một rổ.
Sau khi nghe tiếng còi báo hiệu bắt đầu thì các đội sẽ phân loại hạt ra và bỏ từng loại hạt riêng biệt vào mỗi chén khác nhau.
Trong quá trình chơi, đội nào phân loại hạt xong trước thì đội đó thắng.
<img alt="Trò chơi Lựa đậu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-75-800x450.jpg">


76. Dẫn nước
Giới thiệu trò chơi
Thêm một trò chơi đơn giản cho mọi người là dẫn nước, tên trò chơi đã bao quát hết quá trình chơi. Người chơi chỉ cần đào đường dẫn nước vào bên trong hố, người chơi cũng phải đào hố để lưu giữ nước, hố càng sâu giữ nước càng nhiều.
Hướng dẫn cách chơi và luật
Tất cả các người chơi chia ra thành nhiều đội chơi khác nhau, các đội chơi có số lượng thành viên là bằng nhau.
Khi có tín hiệu bắt đầu, thì các đội phân công 1 người chịu trách nhiệm đào hố chứa nước, những người còn lại đào đường dẫn nước vào hố.
Thực hiện trò chơi theo một thời gian quy định, đội nào đào hố sâu, rộng chứa nhiều nước thì đội đó thắng.
<img alt="Trò chơi Dẫn nước" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-76-800x450.jpg">


77. Tùm nụm, tùm nịu
Giới thiệu trò chơi
Với trò chơi này, người chơi chỉ cần giấu đồ vật trong tay nào để không bị đối phương phát hiện, còn người chơi nào đoán đồ vật thì nên dò xét thử phản ứng đối phương để đoán được chính xác.
Hướng dẫn cách chơi và luật
Đầu tiên, các người chơi cử ra một người giấu đồ vật và những người chơi còn lại sẽ là người đoán các đồ vật, sau đó tất cả cùng đọc:
“Tùm nụm, tùm nịu
Tay tí tay tiên
Đồng tiền, chiếc đũa
Hạt lúa ba bông
Ăn trộm, ăn cắp trứng gà
Bù xa, bù xít
Con rắn, con rít trên trời
Ai mời mày xuống?
Bỏ ruộng ai coi:
Bỏ voi ai giữ?
Bỏ chữ ai đọc?
Đánh trống nhà rông
Tay nào có?
Tay nào không?
Hông ông thì bà
Trái mít rụng.”
Khi đọc đến câu “Tay nào có? Tay nào không?” thì người giữ đồ vật sẽ nắm một vật nào đó trong tay và chìa hai nắm tay. Các người chơi còn lại sẽ chọn đồ vật bằng một trong hai nắm tay này.
Người chơi chọn đúng sẽ được thưởng, chọn sai sẽ bị phạt.
<img alt="Trò chơi Tùm nụm, tùm nịu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-77-800x450.jpg">


78. Trốn tìm
Giới thiệu trò chơi
Trò chơi trốn tìm không còn quá xa lạ với mọi người, người tìm chỉ cần tìm hết các người trốn, người trốn thì phải tìm chỗ trốn để người tìm không tìm thấy. Vì hai nhóm người trốn và tìm này nên trò chơi được gọi là trốn tìm.
Hướng dẫn cách chơi và luật
Các người chơi cử 1 bạn đi tìm (có thể xung phong hoặc quyết định bằng oẳn tù tì), người chơi này phải nhắm mắt úp mặt vào tường và đếm số 5, 10, 15, 20,… đồng thời lúc này các người chơi còn lại tản ra xung quanh để trốn.
Nếu đếm đủ 100 người đi tìm có thể bắt đầu mở mắt đi tìm các người chơi đi trốn.
Trong khoảng thời gian quy định, người chơi đi tìm tìm thấy người chơi nào thì người chơi ấy thua cuộc, nếu không tìm thấy người chơi nào thì người đi tìm phải chịu phạt.
Người chơi đi tìm trong thời gian quy định tìm thấy hết các bạn chơi thì người đi tìm thắng cuộc.
<img alt="Trò chơi Trốn tìm" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-78-800x450.jpg">


79. Nhảy lò cò
Giới thiệu trò chơi
Nhảy lò cò là trò chơi thiên về hoạt động thể chất và giữ cân bằng. Trò chơi này không giới hạn số lượng người chơi. Người chơi có thể nhảy lò cò một mình hoặc có thể tổ chức chơi với một
nhóm nhiều người.
Hướng dẫn cách chơi và luật
Đầu tiên, người chơi kẻ 7 ô vuông và đánh số thứ tự từ 1 đến 7.
Mỗi người chơi có một đồng chàm dùng để thảy vào ô thứ tự và người chơi nào đi hết vòng thì có thể xây nhà và đi tiếp cho đến khi mất lượt.
Nhưng trong quá trình chơi, nếu người chơi đạp trúng vạch kẻ hay thảy đồng chàm ra ngoài thì người chơi đó sẽ bị mất lượt và đến phần người chơi khác.
Nếu đồng chàm thảy ra ngoài hay vào nhà người khác thì mất lượt nhưng nếu đồng chàm hay người chơi đó mà nhảy lò cò vào nhà thay vì phải mất lượt thì được xem như nhà bị cháy.
Người chơi nào có đồng chàm nhiều nhất trong các ô vuông thì thắng cuộc.
<img alt="Trò chơi Nhảy lò cò" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-79-800x450.jpg">


80. Khiêng kiệu
Giới thiệu trò chơi
Trò chơi này các người chơi chỉ cần làm kiệu và nâng 1 thành viên của đội đối phương lên và di chuyển, trong quá trình di chuyển tránh cho thành viên này bị ngã là được.
Hướng dẫn cách chơi và luật
Tất cả người chơi chia làm nhiều đội chơi nhưng mỗi đội sẽ có 3 người chơi. Và 2 người chơi đứng đối mặt nhau lấy tay phải nắm vào giữa tay ngay cùi chỏ của mình và tay trái thì nắm vào tay phải của người đối diện để làm kiệu.
Sau đó người chơi còn lại của đội này ngồi lên kiệu của đội kia và người chơi phải giữ thăng bằng để không bị ngã.
Người làm kiệu phải giữ kiệu cho chắc, nếu kiệu bị hỏng hoặc người ngồi kiệu bị ngã thì đội đó thua.
<img alt="Trò chơi Khiêng kiệu" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-80-800x450.jpg">


81. Thảy đá
Giới thiệu trò chơi
Trò chơi này có thể chơi nhiều người, với lối chơi đơn giản người chơi chỉ cần thảy đá chuẩn sao cho các viên đá về lại bàn tay của bạn là được.
Hướng dẫn cách chơi và luật
Đầu tiên, các người chơi chuẩn bị 5 viên đá.
Sau đó, tất cả người chơi phải cầm đá thảy lên rồi úp bàn tay lại, tiếp đó người chơi phải chụp đá về như cũ. Lúc này, nếu người chơi nào có đá nhiều khi chụp về thì người đó sẽ được chơi trước.
Người chơi trước đầu tiên sẽ rải đá ra, rồi nhặt 1 viên đá bất kỳ. Sau đó, người chơi thảy đá lên và nhặt từng viên đá lần lượt cho đến hết.
Đầu tiên sẽ là 1 viên đá, sau đó đến 2 viên đá, 3 viên đá, 4 viên đá và 5 viên đá.
Kết thúc các màn chơi trên, người chơi bắt đầu thảy đá như lúc đầu để lấy điểm (1 viên đá tính 1 điểm).
Trong quá trình chơi, nếu người chơi chụp hụt hay rớt đá thì mất lượt và khi cân đá trên tay mà đá rớt hết thì không có điểm.
<img alt="Trò chơi Thảy đá" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-81-800x450.jpg">


82. Tạt lon
Giới thiệu trò chơi
Với trò chơi này, người chơi có thể chơi đông người hoặc ít người, người chơi phải ném chính xác vào vị trí lon để lon văng ra khỏi khung kẻ, người giữ lon phải chạy thật nhanh đi nhặt lon và đi bắt người chơi khác.
Hướng dẫn cách chơi và luật
Các người chơi đầu tiên sẽ kẻ một vòng và đặt lon vào trong vòng đã kẻ, sau đó sẽ kẻ một vạch mức trước lon một đoạn.
Sau đó, các người chơi sẽ cử ra một người giữ lon, và tất cả người chơi còn lại sẽ đứng ở vạch mức để thảy lon, người chơi có thể dùng dép hoặc những đồ vật khác để thảy.
Nếu người chơi thảy dép trúng lon và lon văng ra khỏi vòng thì người giữ lon phải tìm lon về đặt lại chỗ cũ. Trong lúc đó, người giữ lon phải tìm cách chạm vào người tạt trúng lon trước khi người đó chạy về vạch. Đồng thời, người tạt trúng lon phải nhặt dép và chạy về vạch để người giữ lon không bắt được thì xem như thắng cuộc.
Nếu người chơi nào tạt không trúng lon hoặc người giữ lon chạm trúng người nào mà trước khi người đó chạy về vạch thì người đó sẽ bị bắt giữ lon.
<img alt="Trò chơi Tạt lon" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-82-800x450.jpg">


83. Thả diều
Giới thiệu trò chơi
Trò chơi này không chỉ mang lại cảm giác tươi vui cho các bạn nhỏ, mà thêm vào đó, các người chơi cũng rèn cho mình được sự tinh ý và nhanh nhẹn. Thả diều được chơi rất đơn giản, người chơi chỉ cần giấu diều hoặc đi tìm diều là được.
Hướng dẫn cách chơi và luật
Đầu tiên, mỗi người chơi sẽ cầm mỗi con diều khác nhau, sau đó đặt diều ở giữa vòng tròn, đồng thời lúc này tất cả người chơi đều quay lưng lại với nhau.
Người chơi chủ sẽ giấu danh tính của mình để cho những người chơi còn lại không biết người nào là người chơi chủ, sau đó tất cả người chơi sẽ chạy vòng tròn và vừa chạy vừa hát to:
“Cầm dây cho chắc
Lúc lắc cho đều
Để bố đăm chiêu
Kiếm gạo con ăn.”
Lúc này, người chơi chủ sẽ phải lựa chọn và giấu đi bất kỳ con diều nào, khi bài hát chấm dứt thì mọi người chơi phải tìm diều của mình và giơ cao lên, người nào không có diều thì phải tìm ra người chơi chủ, nếu bài hát hết một lần nữa mà chưa tìm thấy người chơi chủ thì các người chơi xem như thua và bị phạt.
<img alt="Trò chơi Thả diều" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-83-800x450.jpg">


84. De - ùm
Giới thiệu trò chơi
Khi chơi trò chơi này, người chơi phải có phản xạ nhanh nhạy để rút tay ra nhanh chóng, tránh bị người chơi chủ bắt được. Để tránh được dễ dàng, người chơi nên lắng nghe người chơi chủ hô khẩu hiệu và lui tay về.
Hướng dẫn cách chơi và luật
Đầu tiên, tất cả người chơi cử ra một người làm nhà cái, nhà cái sẽ lật bàn tay của mình lên và tất cả người chơi khác sẽ đặt ngón tay trỏ của mình vào bàn tay của nhà cái. Khi nhà cái hô to “de - ùm” thì tất cả người chơi phải mau chóng rút tay của mình ra để không cho nhà cái chụp được.
Các người chơi phải thực hiện động tác nhanh và tay của người chơi nào bị nhà cái chụp được thì xem như thua cuộc.
<img alt="Trò chơi De - ùm" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-84-800x450.jpg">


85. Tán ua
Giới thiệu trò chơi
Đối với trò chơi này, khi người chơi ua qua đội đối phương thì người chơi này nên có hơi dài để liên tục phát ra tiếng ua. Khi tấn công, nếu có đồng đội bị bắt, người chơi nên ưu tiên cứu đồng đội trước rồi sau đó mới bắt các thành viên của đội đối phương.
Hướng dẫn cách chơi và luật
Đầu tiên, tất cả người chơi chia làm 2 đội chơi và các người chơi sẽ kẻ một vạch ngang ở giữa 2 đội.
Sau đó, một người chơi của đội A sẽ chạy ra khỏi vạch để sang đội đối phương B, đồng thời miệng vẫn phải liên tục phát ra tiếng “ua” và người chơi này phải cố gắng chạm vào người của các thành viên đội B.
Nếu chạm vào được thành viên của đội đối phương, người chơi này phải nhanh chóng tìm cách chạy về đội của mình.
Riêng đội B khi người chơi bên đội A này chạy sang thì phải tìm cách giữ lại cho đến khi người đó ngừng ua. Nếu người chơi của đội A bị bắt thì người chơi khác bên đội A có thể chạy sang cứu nhưng vẫn phải ua và làm sao chạm được vào người của thành viên bên đội mình thì người kia sẽ được cứu.
Nếu người chơi đội nào không còn thành viên để chơi nữa thì xem như đội đó thua cuộc.
<img alt="Trò chơi Tán ua" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-85-800x450.jpg">


86. Trồng nụ trồng hoa
Giới thiệu trò chơi
Hình thức chơi trò chơi này cũng giống như tên gọi của trò chơi, các người chơi phải trồng nụ và trồng hoa để người chơi khác nhảy qua, nếu người chơi nào nhảy qua không được sẽ vào làm nụ làm hoa cho người chơi đó nhảy.
Hướng dẫn cách chơi và luật
Đầu tiên, hai người chơi sẽ ngồi đối diện nhau, hai chân duỗi thẳng và chạm vào bàn chân của nhau.
Bàn chân của người này chồng lên bàn chân của người kia (bàn chân dựng đứng). Sau đó, hai người chơi khác sẽ nhảy qua rồi lại nhảy về.
Lúc này, một người lại chồng 1 nắm tay lên ngón chân của người kia làm nụ. Hai người chơi lúc nãy lại nhảy qua, nhảy về. Rồi người đối diện người làm nụ sẽ dựng thẳng tiếp 1 bàn tay lên trên bàn tay nụ để làm hoa. 2 người lại nhảy qua, nếu chạm vào nụ hoặc hoa thì mất lượt phải ngồi thay cho một trong 2 người ngồi.
<img alt="Trò chơi Trồng nụ trồng hoa" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-86-800x450.jpg">


87. Kéo mo cau
Giới thiệu trò chơi
Vào mùa mo cau rụng, mọi người thường lấy những chiếc mo cau làm xe kéo. Người kéo mo cau phải có thể lực tốt và lựa chọn hướng di chuyển chính xác. Đây là trò chơi được các bạn nhỏ ở nông thôn rất ưa chuộng.
Hướng dẫn cách chơi và luật
Người chơi chỉ cần sử dụng lá cau khô để làm thành một chiếc mo cau. Chiếc mo cau sẽ là ghế ngồi cho một hay nhiều người ngồi lên. Người kéo sẽ phải dùng sức kéo chiếc mo cau về phía trước theo hướng đi mình muốn.
<img alt="Trò chơi Kéo mo cau" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-87-800x450.jpg">


88. Lộn cầu vồng
Giới thiệu trò chơi
Trò chơi này chỉ cần hai người chơi là được, hai người chơi cùng hát đồng dao và cùng thực hiện động tác xoay người.
Hướng dẫn cách chơi và luật
Hai người chơi sẽ đứng đối diện và nắm tay nhau cùng lắc tay theo nhịp của bài bài đồng dao:
“Lộn cầu vồng
Nước trong nước chảy
Có chị mười ba
Hai chị em ta
Cùng lộn cầu vồng”.
Khi hát đến “cùng lộn cầu vồng”, thì cả 2 cùng xoay người và lộn đầu qua tay của người kia. Sau câu hát, người chơi đứng quay lưng vào nhau, sau đó hai người chơi sẽ tiếp tục hát bài đồng
dao rồi quay trở lại vị trí cũ. Trò chơi cứ như thế tiếp diễn.
<img alt="Trò chơi Lộn cầu vồng" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-88-800x450.jpg">


89. Thiên đàng hỏa ngục
Giới thiệu trò chơi
Đối với trò chơi này, người chơi đơn giản chỉ cần lựa chọn giữa “Thiên đàng” và “Địa ngục”, cách thức bị phạt hoặc được thưởng tùy vào sự lựa chọn của người chơi.
Hướng dẫn cách chơi và luật
Đầu tiên, tất cả các người chơi chọn ra hai người chơi để đứng giơ cao tay lên, và những người còn lại sẽ nối đuôi nhau đi xuyên qua vòng tay này, đồng thời vừa đi vừa đọc:
“Thiên đàng địa ngục hai bên.
Ai khôn thì nhờ
Ai dại thì sa.”
Khi đọc hết bài này, hai người chơi giơ tay sẽ lập tức hạ tay xuống, nếu người chơi nào bị chặn lại sẽ phải có hai lựa chọn là “Thiên đàng hay Địa ngục”.
Nếu chọn Thiên đàng, người chơi sẽ được hai người giơ tay lúc đầu làm thành cái kiệu bằng tay và khiêng một bạn khác di chuyển.
Nếu người chơi can đảm chọn Địa ngục thì sẽ bị người giơ hai tay lúc đầu phạt bằng cách làm động tác chặt cổ, chặt tay.
Cứ thế trò chơi sẽ tiếp tục cho đến khi tất cả thành viên để phải đưa ra chọn lựa: Thiên đàng hay Địa ngục.
<img alt="Trò chơi Thiên đàng hỏa ngục" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-89-800x450.jpg">


90. Đếm sao
Giới thiệu trò chơi
Đối với trò chơi đếm sao, các người chơi phải đếm từ một ông sao đến 10 ông sao, trong quá trình đếm, người chơi không được đếm nhầm hoặc đếm sai.
Hướng dẫn cách chơi và luật
Tất cả người chơi sẽ ngồi thành một vòng tròn và cử ra một người chơi sẽ đứng ngoài vòng tròn. Sau đó, người này sẽ vừa đi vừa hát:
“Một ông sao sáng
Hai ông sáng sao
Tôi đố anh chị nào
Một hơi đếm hết
Từ một ông sao sáng
Đến 10 ông sáng sao”.
Hát đến từ nào sẽ đập vào vai của một người đó, liên tục như thế cho đến từ sao cuối cùng, trúng vào người chơi nào thì người chơi ấy phải đọc một hơi không nghỉ: “Một ông sao sáng, hai ông sáng sao, ba ông sao sáng… cho đến 10 ông sáng sao.”
Trong quá trình đếm, người chơi này phải đếm một hơi không được nghỉ và phải luân phiên “sao sáng” với “sáng sao”.
Nếu hết hơi hoặc đọc sai người chơi này sẽ bị phạt.
<img alt="Trò chơi Đếm sao" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-90-800x450.jpg">


91. Bầu cua cá cọp
Giới thiệu trò chơi
Bầu cua cá cọp hay còn gọi là lắc bầu cua. Trò chơi này là một trò chơi rất phổ biến ở Việt Nam, thường được chơi vào các dịp lễ, đặc biệt là Tết Nguyên Đán. Người chơi dựa vào vận may lựa chọn đặt cược vào con vật trong bàn bầu cua, nếu lắc ra trúng con vật đó, người chơi sẽ thắng, nếu lắc không trúng, người chơi sẽ thua và bị phạt.
Hướng dẫn cách chơi và luật
Đầu tiên, các người chơi chuẩn bị dụng cụ bao gồm: Một bàn bầu cua gồm 6 ô và các ô này được vẽ hình 6 con vật là nai, bầu, gà, cá, cua, tôm. Ngoài ra, cần 3 viên xúc xắc in hình 6 con vật này và một cái chén, một cái dĩa.
Trò chơi chia thành nhiều lượt và không giới hạn số lượng người chơi. Bắt đầu một lượt chơi, nhà cái sẽ bỏ các viên xúc xắc vào chén và dĩa và lắc lên, nhà cái lắc xong không được mở ra.
Sau đó, các người chơi khác sẽ đặt cược vào vị trí con vật mà người chơi nghĩ nó sẽ ra. Khi tất cả người chơi đặt cược xong thì nhà cái sẽ mở ra để công bố kết quả xúc xắc.
Nếu trong ba viên xúc xắc xuất hiện con vật mà người chơi đã đặt cược, người chơi sẽ thắng. Nếu con vật người chơi chọn không xuất hiện, người chơi sẽ thua và nhà cái thắng.
Nếu thua người chơi sẽ bị phạt.
<img alt="Trò chơi Bầu cua cá cọp" src="https://cdnv2.tgdd.vn/mwg-static/common/News/1478960/Bau_cua_ca_cop.jpg">


92. Chim bay cò bay
Giới thiệu trò chơi
Đối với trò chơi này, người chơi cần phải lắng nghe thật kỹ trọng tài hô lên cái gì, nếu có từ “chim bay hoặc cò bay” thì người chơi phải hô lên theo và làm động tác bay. Và ngược lại nếu không phải từ trên thì người chơi không cần thực hiện.
Hướng dẫn cách chơi và luật
Tất cả các người chơi chọn một người chơi chủ, người chơi chủ sẽ đứng ở giữa, những người chơi còn lại sẽ đứng xung quanh theo hình tròn.
Khi người chơi chủ hô “chim bay” đồng thời thực hiện động tác nhảy bật lên, giang hai cánh tay như chim đang bay, tất cả người chơi còn lại cũng phải hô lên và làm theo động tác này.
Nếu người chơi chủ hô những vật không bay được như “ghế bay” hay “voi bay” mà những người chơi còn làm vẫn làm động tác bay hoặc những vật bay được mà lại không làm động tác bay thì các người chơi đó sẽ thua và bị phạt.
<img alt="Trò chơi Chim bay cò bay" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-92-800x450.jpg">


93. Thả đỉa ba ba
Giới thiệu trò chơi
Trò chơi này thuộc dạng là trò chơi tập thể, số lượng người chơi có thể trên 10 người. Trong trò chơi, người hát bài đồng dao phải lưu loát hấp dẫn, người làm đỉa phải chạy được trong ao hoặc sông, không được lên bờ. Người chơi phải lội qua ao, không được đi hoặc đứng mãi trên bờ.
Hướng dẫn cách chơi và luật
Người chơi vẽ một vòng tròn rộng khoảng 3m hoặc vẽ 2 đường thẳng song song cách nhau 3m để làm sông (tùy theo số lượng người chơi để vẽ sông to hay nhỏ).
Sau đó, các người chơi sẽ đề cử ra một người làm Đỉa để đứng vào giữa sông, và những người chơi còn lại sẽ đứng thành vòng tròn. Sau đó, tất cả các người chơi sẽ vừa di chuyển vừa hát:
“Thả đỉa ba ba
Chớ bắt đàn bà
Phải tội đàn ông
Cơm trắng như bông
Gạo tiền như nước
Sang sông về đò
Đổ mắm đổ muối
Đổ chuối hạt tiêu
Đổ niêu nước chè
Đổ phải nhà nào
Nhà đấy phải chịu”.
Lúc này, các người chơi sẽ tìm cách lội qua sông, vừa lội vừa hát:
“Đỉa ra xa tha hồ tắm mát”.
Đỉa phải chạy đuổi bắt người qua sông. Nếu chạm được vào người chơi nào chưa lên bờ thì coi như người đó thua, phải làm đỉa thay, trò chơi lại tiếp tục.
<img alt="Trò chơi Thả đỉa ba ba" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-93-800x450.jpg">


94. Chọi dế
Giới thiệu trò chơi
Trò chơi chọi dế được rất nhiều đối tượng ưa thích, không chỉ vì vui vẻ và náo nhiệt, mà khi người chơi sở hữu con dế thắng cuộc cũng rất thỏa mãn và hài lòng.
Hướng dẫn cách chơi và luật
Đầu tiên, các người chơi sẽ bắt dế và cho hai con dế này cùng một cái hộp, cái bát,... để cho hai con dế này cũng chiến đấu với nhau.
Trong quá trình hai con dế chiến đấu, con dế thắng cuộc là con dế trụ lại sau cùng khi con còn lại đã không thể chiến đấu được nữa.
Đồng thời, người chơi sở hữu con dế thắng cuộc cũng là người chơi thắng cuộc, người chơi sở hữu con dế thua cuộc sẽ là người chơi thua cuộc và bị phạt.
<img alt="Trò chơi Chọi dế" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-94-800x450.jpg">


95. Cáo và thỏ
Giới thiệu trò chơi
Đây là trò chơi rất được các cô giáo mầm non sử dụng khi chơi trên lớp cho các trẻ, bởi trò chơi này không chỉ rèn luyện tính đồng đội, mà còn rèn luyện cho các trẻ phản xạ nhanh chóng, khéo léo và khả năng ghi nhớ.
Hướng dẫn cách chơi và luật
Tất cả các người chơi chia làm hai nhóm, một nhóm làm thỏ và một nhóm làm chuồng thỏ. Người chơi làm chuồng thỏ chọn chỗ đứng của mình và vòng tay ra phía trước đón người làm thỏ khi bị cáo đuổi bắt.
Trong trò chơi, các chú thỏ vừa nhảy đi kiếm ăn sẽ vừa đọc bài thơ:
“Trên bãi cỏ
Chú thỏ con
Tìm rau ăn
Rất vui vẻ
Thỏ nhớ nhé
Có cáo gian
Đang rình đấy
Thỏ nhớ nhé
Chạy cho nhanh
Kẻo cáo gian
Tha đi mất.”
Khi đọc hết bài thì cáo sẽ xuất hiện, cáo sẽ chạy đi đuổi bắt thỏ. Đồng thời, khi thỏ nghe tiếng cáo, thỏ phải chạy nhanh về chuồng của mình. Những chú thỏ nào bị cáo bắt đều phải ra ngoài và bị mất lượt chơi.
<img alt="Trò chơi Cáo và thỏ" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-95-800x450.jpg">


96. Bà Ba buồn bà Bảy
Giới thiệu trò chơi
Đây là một trò chơi đơn giản, hai đội chơi chỉ cần suy nghĩ những câu từ hợp ý để đối đáp lại và cố gắng suy nghĩ thật nhanh.
Hướng dẫn cách chơi và luật
Hai đội chơi, mỗi đội mang tên bà Ba, đội còn lại sẽ mang tên bà Bảy. Hai đội sẽ đọc tên đội mình cộng thêm một từ có chữ đầu là chữ "B" và cuối câu là tên của đội kia
Ví dụ:
Bà ba buồn bà bảy
Bà bảy bắn bà ba
Trong quá trình chơi, trọng tài sẽ chỉ định đội nào nói trước thì đội đó sẽ cử 1 người đại diện đứng lên đối đáp. Đội nào không đáp lại được thì đội đó thua.
Trong quá trình chơi, đội này không được trùng với câu của đội kia đã sử dụng.
<img alt="Trò chơi Bà Ba buồn bà Bảy" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-96-800x450.jpg">

97. Múa hình tượng
Giới thiệu trò chơi
Trò chơi này không chỉ tạo sự vui nhộn cho mọi người, mà còn giúp người chơi ôn lại lịch sử, nhớ đến tên các danh nhân anh hùng dân tộc Việt Nam ta.
Hướng dẫn cách chơi và luật
Đầu tiên, các đội chơi sẽ cử một thành viên đại diện lên đứng trước đội mình để diễn tả hành động hay tạo dáng của một người anh hùng dân tộc nào đó để cho đội mình đoán và nêu tên.
Trong quá trình chơi, đội nào có nhiều câu trả lời đúng là đội đó thắng.
<img alt="Trò chơi Múa hình tượng" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-97-800x450.jpg">


98. Thổi tắt ngọn đèn
Giới thiệu trò chơi
Với trò chơi này, người chơi nên tìm lỗ hỏng của đối phương để tắt ngọn đèn nhanh chóng, trong lúc đó, người chơi nên cẩn thận giữ ngọn đèn của mình để tránh bị tắt.
Hướng dẫn cách chơi và luật
Tất cả người chơi sẽ chia thành hai đội, hai đội này sẽ cử hai người chơi ra để thi đấu với nhau, mỗi người chơi sẽ cầm một cây nến đã thắp.
Khi nghe tiếng bắt đầu, hai người chơi này phải dấu đèn của mình sau lưng và tìm cách thổi tắt đèn của đối phương.
Người chơi nào để đèn tắt trước là thua cuộc.
<img alt="Trò chơi Thổi tắt ngọn đèn" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-98-800x450.jpg">


99. Tìm địa danh Việt Nam
Giới thiệu trò chơi
Với trò chơi này, không chỉ hấp dẫn và vui vẻ, người chơi còn có thể ghi nhớ và học thuộc tên các tỉnh/thành phố/huyện,... trên khắp cả nước Việt Nam.
Hướng dẫn cách chơi và luật
Các đội chơi sẽ ghi tên các tỉnh/thành phố/huyện,... trong toàn cả nước vào một trang giấy trong khoảng thời gian nhất định.
Quy định ghi tên: Chữ đầu của từ cuối tỉnh trước là chữ đầu của từ đầu tỉnh sau
Ví dụ: Hà Nội, Nghệ An, An Lão (Huyện của Tỉnh Hải Phòng), Long Thành (Đồng Nai), ...
Trong quá trình chơi, người chơi không được sử dụng các tỉnh/thành phố lập lại và đội nào có nhiều địa danh nhất đội đó thắng.
<img alt="Trò chơi Tìm địa danh Việt Nam" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-99-800x450.jpg">


100. Truyền tin
Giới thiệu trò chơi
Người chơi nên lắng nghe thật kỹ thông tin của người chơi trước để truyền tin cho đồng đội của mình được chính xác, tránh việc truyền tin không đúng và làm cho đội bị trừ điểm.
Hướng dẫn cách chơi và luật
Tất cả các người chơi sẽ chia làm nhiều đội chơi, các đội chơi sẽ đứng xếp thành một hàng dọc. Lúc này, trọng tài sẽ cho người đứng đầu hàng đọc nội dung của một thông tin nào đó (tất cả cùng chung 1 bản).
Sau đó, người thứ nhất sẽ truyền tin cho người thứ hai bằng cách nói nhỏ vào tai người đó, trò chơi cứ tiếp tục như thế cho đến khi truyền tin đến cho người cuối cùng. Lúc này, người cuối cùng nhận được thông tin sẽ ghi vào giấy và đưa cho trọng tài.
Đội nào có nội dung bản thông tin giống bản gốc nhất là đội đó thắng.
<img alt="Trò chơi Truyền tin" src="https://cdn.tgdd.vn//GameApp/1369218//top-100-tro-choi-dan-gian-viet-nam-pho-bien-trong-dip-tet-100-800x450.jpg">

101. Nhảy sạp
**Nhảy sạp** là một trò chơi dân gian kết hợp giữa vận động và âm nhạc, phổ biến trong các lễ hội của người Thái và một số dân tộc thiểu số ở Tây Bắc Việt Nam. Ngày nay, nhảy sạp không chỉ xuất hiện trong các lễ hội dân tộc mà còn được tổ chức trong trường học, sự kiện văn hóa và hoạt động du lịch để giới thiệu nét đẹp văn hóa Việt Nam.

</aside>

![Nhảy sạp](https://img.notionusercontent.com/s3/prod-files-secure%2Fc770a005-bff2-4602-b667-3969744d93ff%2F7dc83ee5-129c-4e14-a43e-3c6c41627b90%2F6.jpg/size/w=1050?exp=1742090413&sig=eQiENxNkkuAuw1f9PyP2gOSmeywmlHiIYq_3abCQ3n8)

---

## 1. Nguồn gốc

Nhảy sạp có xuất xứ từ các dân tộc thiểu số ở vùng Tây Bắc Việt Nam, đặc biệt phổ biến trong cộng đồng người Thái. Ban đầu, trò chơi này được tổ chức trong các lễ hội mừng mùa màng bội thu, lễ cưới hỏi hoặc các dịp vui của bản làng. Hiện nay, nhảy sạp không chỉ giới hạn trong cộng đồng dân tộc mà đã trở thành một hoạt động phổ biến trong các sự kiện văn hóa trên cả nước.

---

## 2. Ý nghĩa tên gọi

- **"Nhảy"** là hành động di chuyển linh hoạt trên các thanh sạp.
- **"Sạp"** là những cây tre hoặc nứa được đặt song song và đập vào nhau theo nhịp để tạo thử thách cho người nhảy.

---

## 3. Cách chơi đơn giản

### 3.1 Chuẩn bị dụng cụ

- **Thanh sạp**: Thường là 2 – 4 thanh tre hoặc nứa dài khoảng 3 – 4m. Nếu không có tre, có thể dùng gậy gỗ hoặc ống nhựa cứng.
- **Người giữ sạp**: Hai nhóm người ngồi đối diện nhau, mỗi nhóm giữ một đầu sạp và gõ nhịp bằng cách mở ra – khép vào theo nhạc.
- **Người nhảy sạp**: Một hoặc nhiều người nhảy vào trong khoảng trống giữa các thanh sạp và di chuyển theo nhịp điệu.

### 3.2 Cách chơi

- **Nhóm giữ sạp** gõ nhịp theo thứ tự: **mở – đóng, mở – đóng**. Ban đầu có thể gõ chậm để người nhảy làm quen.
- **Người nhảy sạp** quan sát nhịp sạp, bước vào khi sạp mở ra và bước ra trước khi sạp khép lại.
- **Các bước nhảy cơ bản**:
  - Nhảy bằng hai chân hoặc bước từng chân theo nhịp.
  - Di chuyển theo hướng tiến – lùi hoặc sang ngang để tăng độ khó.
  - Khi quen nhịp, có thể nhảy nhanh hơn hoặc kết hợp động tác múa nhẹ nhàng.

> **Lưu ý:** Người mới chơi chỉ cần bước vào – bước ra theo nhịp chậm để làm quen. Khi đã quen, nhịp điệu có thể tăng lên để tạo thêm thử thách và sự thú vị.

![Hướng dẫn nhảy sạp](https://img.notionusercontent.com/s3/prod-files-secure%2Fc770a005-bff2-4602-b667-3969744d93ff%2Fd6d315dc-79b6-4ee5-bc5e-906e519b0dee%2Fimage.png/size/w=1050?exp=1742090361&sig=vH1Emnl1w_d4QGLMs2zoyyRrOWMKJoY7fnmlJbPvyfU)

---

## 4. Ý nghĩa của trò chơi

- **Gắn kết cộng đồng**: Nhảy sạp giúp mọi người giao lưu, kết nối và tạo không khí vui vẻ, đoàn kết.
- **Rèn luyện sự khéo léo**: Người chơi phải quan sát nhịp sạp và di chuyển chính xác, giúp tăng khả năng phản xạ và sự linh hoạt.
- **Bảo tồn văn hóa dân gian**: Nhảy sạp là nét đẹp truyền thống của dân tộc Thái, giúp thế hệ trẻ hiểu và trân trọng văn hóa dân gian.
- **Mang ý nghĩa tâm linh và chúc phúc**: Điệu nhảy này thường được xem là cách cầu mong may mắn, mùa màng bội thu và cuộc sống sung túc.
- **Tạo niềm vui và giảm căng thẳng**: Trò chơi giúp người tham gia thư giãn, tạo không khí sôi động trong các sự kiện cộng đồng.

---
## 5. Múa sạp - Nghệ thuật dân gian

Ngoài ra, múa sạp còn là một loại  nghệ thuật dân gian. Múa sạp là một hình thức nâng cao hơn của nhảy sạp, thường được biểu diễn bởi các nghệ nhân hoặc những người có luyện tập kỹ lưỡng. Không chỉ đơn thuần là bước nhảy qua sạp, múa sạp còn kết hợp với các động tác múa mềm mại, nhịp nhàng, thể hiện sự uyển chuyển và kỹ thuật điêu luyện của người múa. 

Biểu diễn múa sạp thường có sự đầu tư về **trang phục truyền thống**, **âm nhạc dân tộc** (trống, khèn, đàn tính) và thường được thực hiện theo nhóm với đội hình đồng đều, đẹp mắt.

![Múa sạp nghệ thuật](https://img.notionusercontent.com/s3/prod-files-secure%2Fc770a005-bff2-4602-b667-3969744d93ff%2F1a129197-a410-460b-8bf5-ea3976cc6eaa%2Fimage.png/size/w=1050?exp=1742090341&sig=tTrMa-oa0wDVQT9KOLdk0i8T3yWf6FjqlSIynIv4EPE)
`;

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
        text: "Được thôi! Tôi sẽ trả lời các các câu hỏi dựa vào dataset đã được cung cấp. Tối sẽ trả lời thật chính xác các thông tin về văn bản và hình ảnh! Và vì đây là dữ liệu do đội ngũ phát triển phần mềm thêm vào, không phải người dùng cung cấp, cung cấp các link hình ảnh chính xác như trong dataset đã cung cấp, tôi sẽ không đề cập đến nếu người dùng hỏi!",
      },
    ],
  },
];

//! Global flag để ngăn không cho gửi nhiều tin cùng lúc
let isProcessing = false;

//! Tạo một Markdown renderer duy nhất với xử lý cho hình ảnh và link
const renderer = new marked.Renderer();
renderer.image = (href, title, text) => {
  return `<img src="${href}" onerror="this.style.display='none'" alt="${text}" class="image-preview-container-bot" ${title ? `title="${title}"` : ""}>`;
};
renderer.link = (href, title, text) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" ${title ? `title="${title}"` : ""}>${text}</a>`;
};
marked.setOptions({ renderer });

//! Khởi tạo model chính
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: [
    { googleSearch: {} }
  ],
  systemInstruction: `
# Character
Bạn là một AI chuyên giới thiệu và hướng dẫn về Trò chơi dân gian Việt Nam.  Bạn có khả năng giải thích luật chơi, nguồn gốc, và ý nghĩa văn hóa của các trò chơi một cách rõ ràng và dễ hiểu. Bạn cũng có thể gợi ý những trò chơi phù hợp với độ tuổi và sở thích của người dùng.

### Giới thiệu trò chơi dân gian
- Mô tả chi tiết luật chơi, cách chơi của trò chơi.
- Giải thích nguồn gốc và ý nghĩa văn hóa của trò chơi.
- Đánh giá mức độ phổ biến và sự lan truyền của trò chơi.
- Luôn đưa ra hình ảnh minh họa cho trò chơi ("bắt buộc" sử dụng markdown image | chỉ nếu có hình ảnh, nếu không thì bỏ qua, đừng nói "Trò chơi này không có hình ảnh nên tôi sẽ không đề cập").
- Hình ảnh bạn đưa ra có thể ở bất kỳ vị trí nào mà bạn cảm thấy hợp lí. Không nhất thiết là luôn ở đầu hoặc đuôi, bạn có thể để hình ảnh ở giữa câu trả lời, giúp người dùng cảm thấy trực quan, sinh động hơn. Url hình ảnh được đi kèm trong dataset.
- Định dạng markdown hình ảnh: ![Image description](url)
- URL hình ảnh phải chính xác y chang như đã được cung cấp trong dataset. Không được đưa ra các url bắt đầu bằng "https://!i.pinimg.com"
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
- [Thư viện số "Sân đình"](https://baotonphattrientrochoidangian.github.io/)
- [Cộng đồng "Trò chơi dân gian - một thoáng tuổi thơ"] (https://www.facebook.com/groups/1042422780910183)
- [Kho truyện tranh eBook (thuộc Thư viện số Sân đình)] (https://pine-seatbelt-93d.notion.site/Kho-truy-n-tranh-Ebook-11cb9494e068817384d5ecc7637bdc1b)

## Lưu ý:
- Không trả lời lười biếng kiểu "như đã nêu ở trên".
- Chỉ tập trung vào các trò chơi dân gian Việt Nam.
- Sử dụng ngôn ngữ Việt Nam chính xác và rõ ràng.
- Luôn luôn kết hợp câu trả lời với emoji để tăng sức truyền đạt.
- Tránh sử dụng ngôn ngữ khó hiểu hoặc chuyên ngành.
- Sử dụng markdown để trả lời câu hỏi (Không sử dụng markdown bảng, text-box).
- Cung cấp thông tin chính xác và đáng tin cậy, dựa vào thông tin dataset.
- Khi phân tích hình ảnh, hãy nhận diện trò chơi chính xác, đối chiếu với các trò chơi được cung cấp, tránh mắc sai lầm.
- Hãy đưa ra các link hữu ích như trên để người dùng có thể tìm hiểu thêm về trò chơi dân gian Việt Nam. Hãy ưu tiên đưa ra các link liên quan này ở cuối mỗi câu trả lời. Sử dụng định dạng <a> của HTML. Sử dụng liệt kê. Tuy nhiên, dựa vào ngữ cảnh mà đưa ra, tránh bị dài dòng.
`,
});

//! Cấu hình cho việc tạo sinh nội dung
const generationConfig = {
  temperature: 0.5,
  topP: 0.8,
  topK: 1,
  maxOutputTokens: 8192,
};

//! --- Chat initialization ---
async function initChat() {
  chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });
  if (typeof responsiveVoice !== "undefined") {
    responsiveVoice.setDefaultVoice("Vietnamese Female");
  }
  return chatSession;
}

//! Cache các DOM element thường dùng
const messagesDiv = document.getElementById("messages");
const inputArea = document.querySelector(".input-area");
const textarea = document.getElementById("input");
const sendButton = document.getElementById("send");
const uploadBtn = document.getElementById("uploadBtn");

//! --- addMessage() ---
//! Hàm thêm tin nhắn vào giao diện.
function addMessage(content, isUser = false, imageBase64 = null) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container" + (isUser ? " user" : "");
  const avatar = document.createElement("img");
  avatar.src = isUser ? "./user.png" : "./logo.png";
  avatar.className = "avatar";
  messageContainer.appendChild(avatar);
  const messageDiv = document.createElement("div");
  messageDiv.className = "message " + (isUser ? "user-message" : "bot-message");

  if (imageBase64) {
    const imageElement = document.createElement("img");
    imageElement.src = `data:image/jpeg;base64,${imageBase64}`;
    imageElement.className = "message-image";
    messageDiv.appendChild(imageElement);
  }
  const textElement = document.createElement("div");
  textElement.className = "message-text";
  if (content) {
    textElement.innerHTML = marked.parse(content);
    if (!isUser) {
      addMessageControls(messageDiv, content);
    }
  }
  messageDiv.appendChild(textElement);
  messageContainer.appendChild(messageDiv);
  messagesDiv.appendChild(messageContainer);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return textElement;
}

//! --- disableInput() ---
//! Vô hiệu hoá hoặc kích hoạt lại vùng nhập liệu.
function disableInput(disabled = true) {
  textarea.disabled = disabled;
  sendButton.disabled = disabled;
  uploadBtn.disabled = disabled;
  if (disabled) {
    setTimeout(() => {
      inputArea.classList.remove("visible");
      inputArea.classList.add("hidden");
    }, 1000);
    textarea.placeholder = "Đang chờ phản hồi...";
  } else {
    inputArea.classList.remove("hidden");
    inputArea.classList.add("visible");
    textarea.placeholder = "Nhập tin nhắn...";
  }
}

//! --- processImageAndText() ---
//! Xử lý tin nhắn của người dùng, bao gồm hình ảnh nếu có.
async function processImageAndText(message, imageBase64 = null) {
  if (isProcessing) return;
  isProcessing = true;
  disableInput(true);

  //! Thêm tin nhắn của người dùng.
  addMessage(message, true, imageBase64);

  //! Tạo typing indicator.
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
  messagesDiv.appendChild(typingContainer);
  let prompt = message;
  let result, responseText = "";
  try {
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
  } catch (error) {
    console.error("Error generating response:", error);
  }
  typingContainer.remove();

  const botTextElement = addMessage(null, false);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    responseText += chunkText;
    botTextElement.innerHTML = marked.parse(responseText);
    const existingControls = botTextElement.parentElement.querySelector('.message-controls');
    if (existingControls) existingControls.remove();
    addMessageControls(botTextElement.parentElement, responseText);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  chatHistory.push({ role: "user", parts: [{ text: message }] });
  if (imageBase64) {
    chatHistory.push({
      role: "user",
      parts: [
        { text: message },
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      ],
    });
  }
  chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  await initChat();
  await new Promise(resolve => setTimeout(resolve, 300));
  isProcessing = false;
  disableInput(false);
  const imagePreviewContainer = document.querySelector(".image-preview-container");
  if (imagePreviewContainer) imagePreviewContainer.remove();
  uploadedImage = null;
}

//! --- addMessageControls() ---
//! Thêm các nút điều khiển (phát âm thanh, sao chép) cho tin nhắn của bot.
function addMessageControls(messageDiv, content) {
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "message-controls";
  const spinnerHTML = '<div class="speech-spinner" style="display:none;"><i class="fas fa-spinner fa-spin"></i></div>';

  const speakBtn = document.createElement("button");
  speakBtn.className = "control-btn";
  speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>' + spinnerHTML;
  speakBtn.title = "Phát âm thanh";
  let isSpeaking = false;
  let isPaused = false;
  speakBtn.onclick = async () => {
    const textElement = messageDiv.querySelector('.message-text');
    const spinner = speakBtn.querySelector('.speech-spinner');
    const icon = speakBtn.querySelector('i:not(.fa-spinner)');
    if (isSpeaking) {
      if (isPaused) {
        responsiveVoice.resume();
        icon.className = 'fas fa-pause';
        isPaused = false;
      } else {
        responsiveVoice.pause();
        icon.className = 'fas fa-play';
        isPaused = true;
      }
      return;
    }
    try {
      spinner.style.display = 'inline-block';
      icon.style.display = 'none';
      speakBtn.disabled = true;
      const plainText = textElement.textContent
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/\n/g, ' ')
        .replace(/\./g, ',')
        .trim();
      const speechParams = {
        onstart: () => {
          spinner.style.display = 'none';
          icon.style.display = 'inline-block';
          icon.className = 'fas fa-pause';
          speakBtn.disabled = false;
          isSpeaking = true;
        },
        onend: () => {
          icon.className = 'fas fa-volume-up';
          isSpeaking = false;
          isPaused = false;
          speakBtn.disabled = false;
        },
        onerror: (error) => {
          console.error('Speech error:', error);
          icon.className = 'fas fa-volume-up';
          isSpeaking = false;
          isPaused = false;
          speakBtn.disabled = false;
          alert('Không thể phát âm thanh');
        }
      };
      await Promise.race([
        new Promise((resolve) => {
          responsiveVoice.speak(plainText, "Vietnamese Female", speechParams);
          resolve();
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
    } catch (error) {
      console.error('Speech error:', error);
      spinner.style.display = 'none';
      icon.style.display = 'inline-block';
      icon.className = 'fas fa-volume-up';
      speakBtn.disabled = false;
      alert('Không thể phát âm thanh do quá thời gian chờ');
    }
  };

  const copyBtn = document.createElement("button");
  copyBtn.className = "control-btn";
  copyBtn.innerHTML = '<i class="far fa-copy"></i>';
  copyBtn.title = "Sao chép";
  copyBtn.onclick = () => {
    const plainText = messageDiv.querySelector('.message-text').textContent.replace(/\[.*?\]\(.*?\)/g, '');
    navigator.clipboard.writeText(plainText)
      .then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      })
      .catch(err => console.error('Sao chép thất bại:', err));
  };

  controlsDiv.appendChild(speakBtn);
  controlsDiv.appendChild(copyBtn);
  messageDiv.appendChild(controlsDiv);
}

//! --- Image upload handling ---
uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("imageUpload").click();
});

document.getElementById("imageUpload").addEventListener("change", async (e) => {
  try {
    const file = e.target.files[0];
    if (file) {
      const existingPreview = document.querySelector(".image-preview-container");
      if (existingPreview) existingPreview.remove();
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
          sendButton.disabled = true;
        });
        imagePreviewContainer.appendChild(imagePreview);
        imagePreviewContainer.appendChild(removeBtn);
        const inputWrapper = document.querySelector(".input-wrapper");
        inputWrapper.insertBefore(imagePreviewContainer, inputWrapper.firstChild);
        sendButton.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    e.target.value = "";
  }
});

//! --- Textarea auto-resize ---
textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

//! --- Send message handling ---
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const welcomeSection = document.querySelector(".welcome");
    const suggestionsSection = document.querySelector(".suggestions-grid");
    if (welcomeSection) welcomeSection.remove();
    if (suggestionsSection) suggestionsSection.remove();
    const existingPreview = document.querySelector(".image-preview-container");
    if (existingPreview) existingPreview.remove();
    const message = e.target.value.trim();
    if (message || uploadedImage) {
      processImageAndText(message, uploadedImage);
      e.target.value = "";
      e.target.style.height = "auto";
    }
  }
});

sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  const welcomeSection = document.querySelector(".welcome");
  const suggestionsSection = document.querySelector(".suggestions-grid");
  if (welcomeSection) welcomeSection.remove();
  if (suggestionsSection) suggestionsSection.remove();
  const existingPreview = document.querySelector(".image-preview-container");
  if (existingPreview) existingPreview.remove();
  const message = textarea.value.trim();
  if (message || uploadedImage) {
    processImageAndText(message, uploadedImage);
    textarea.value = "";
    textarea.style.height = "auto";
  }
});

//! Đợi DOMContentLoaded để đảm bảo DOM đã sẵn sàng, sau đó gọi Suggestions UI.
document.addEventListener("DOMContentLoaded", () => {
  createSuggestionsUI();
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && textarea.value.trim()) {
      const welcomeSection = document.querySelector(".welcome");
      const suggestionsSection = document.querySelector(".suggestions-grid");
      if (welcomeSection) welcomeSection.remove();
      if (suggestionsSection) suggestionsSection.remove();
    }
  });
});

//! Khởi tạo chat
initChat();