function cleanHtml(str) {
    let result = '';
    let i = 0;
    let currentTag = '';
    let inTag = false;
    let inDiv = false;
    let inP = false;
    
    while (i < str.length) {
        if (str[i] === '<') {
            inTag = true;
            currentTag = '<';
        }
        else if (str[i] === '>') {
            currentTag += '>';
            
            // Xử lý các loại tag
            let tagLower = currentTag.toLowerCase();
            
            if (tagLower.startsWith('<div')) {
                inDiv = true;
                if (result && !result.endsWith('\n')) {
                    result += '\n';
                }
            }
            else if (tagLower.startsWith('</div')) {
                inDiv = false;
                if (!result.endsWith('\n')) {
                    result += '\n';
                }
            }
            else if (tagLower.startsWith('<p')) {
                inP = true;
                if (result && !result.endsWith('\n')) {
                    result += '\n';
                }
            }
            else if (tagLower.startsWith('</p')) {
                inP = false;
                if (!result.endsWith('\n')) {
                    result += '\n';
                }
            }
            else if (tagLower.startsWith('<img')) {
                result += currentTag + ' ';
            }
            
            inTag = false;
            currentTag = '';
        }
        else if (inTag) {
            currentTag += str[i];
        }
        else if (!inTag) {
            // Thêm ký tự nếu không phải khoảng trắng thừa
            if (!(str[i] === ' ' && result.endsWith(' '))) {
                result += str[i];
            }
        }
        
        i++;
    }
    
    // Xử lý kết quả cuối cùng
    return result
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
        .trim();
}

// Test
const html = `

`;

console.log(cleanHtml(html));