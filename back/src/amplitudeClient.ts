import Amplitude from "amplitude";
import dotenv from "dotenv";
dotenv.config();

const amplitudeApiKey = process.env.AMPLITUDE_API_KEY;

if (!amplitudeApiKey) {
  throw new Error("AMPTITUDE_API_KEY is not set in environment variables");
}

const amplitude = new Amplitude(amplitudeApiKey);

export default amplitude;
