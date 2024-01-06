module.exports = async (current, total) => {
            const progress = current / total;
            const barArray = [];
            
            for (i = 1; i < 11; i++){
                if(progress > (0.1 * i) - 0.01 || barArray.includes("🔘")){
                    barArray.push("▬");
                } else {
                    barArray.push("🔘");
                }
            }
            
            return {
                progress: progress * 100,
                barArray: barArray
            }
}