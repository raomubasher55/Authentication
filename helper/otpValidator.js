const oneMinuteExpiry = async (otpTime) => {
    try {
        const currentDateTime = new Date();
        // Convert otpTime to milliseconds and calculate the difference
        const differenceValue = (currentDateTime.getTime() - new Date(otpTime).getTime()) / 1000 / 60; // Difference in minutes
        
        console.log("Time since last OTP sent (in minutes): " + differenceValue);
        
        if (differenceValue >= 1) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        return false; // In case of error, return false to avoid sending OTP
    }
};
const threeMinuteExpiry = async (otpTime) => {
    try {
        const currentDateTime = new Date();
        // Convert otpTime to milliseconds and calculate the difference
        const differenceValue = (currentDateTime.getTime() - new Date(otpTime).getTime()) / 1000 / 60; // Difference in minutes
        
        console.log("Time since last OTP sent (in minutes): " + differenceValue);
        
        if (differenceValue >= 3) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        return false; // In case of error, return false to avoid sending OTP
    }
};

module.exports = {
    oneMinuteExpiry,
    threeMinuteExpiry,
};
