function typeWriter(text, interval, defaultSpecialPause, defaultSpecialPauseAt, uniquePauseAt) {
    const quote = text; // 设置要显示的文本
    if (i < quote.length) {
        document.getElementById("quote").innerHTML += quote.charAt(i++); // 显示内容的同时，追加下一个字符

        // 检查是否需要 特殊暂停
        if (defaultSpecialPause) {
            if (defaultSpecialPauseAt.includes(i)) {
                setTimeout(typeWriter, defaultSpecialPause);
            } else {
                setTimeout(typeWriter, interval);
            }
        } 
        
        else if (uniquePauseAt) {
            if (uniquePauseAt[i] != null) {
                // 如果有特定的暂停时间
                setTimeout(typeWriter, uniquePauseAt[i]);
            } else {
                // 没有特定时间则使用默认间隔
                setTimeout(typeWriter, interval);
            }
        } 
        
        else {
            setTimeout(typeWriter, interval); // 每interval毫秒显示下一个字
        }
    }
}