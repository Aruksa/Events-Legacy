export const removeZFromUTCDateString = (dateString: string) => dateString.slice(0, 16);
export const todayAsLocaleString = () => removeZFromUTCDateString(new Date().toISOString());
