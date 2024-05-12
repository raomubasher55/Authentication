const fs = require('fs').promises;

const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return { success: true, message: "File deleted successfully" };
    } catch (error) {
        console.error("Error deleting file:", error);
        return { success: false, message: error.message };
    }
};

module.exports = { deleteFile };    
