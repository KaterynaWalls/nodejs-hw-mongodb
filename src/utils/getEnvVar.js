import 'dotenv/config';

console.log("✅ Завантажені змінні оточення:", process.env);
export const getEnvVar = (name, defaultValue) => {
    const value = process.env[name];
    if(value) { console.log(`✅ ${name}:`, value);
     return value;
}
if (defaultValue) {
    console.log(`⚠ ${name} не знайдено, використовую default:`, defaultValue);
    return defaultValue;
}
    throw new Error(`Environment variable ${name} not found.`);
};