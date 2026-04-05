import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_API_SECRET;

if (!keyId || !keySecret) {
  throw new Error(
    'Missing required Razorpay environment variables: RAZORPAY_KEY_ID and/or RAZORPAY_API_SECRET'
  );
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export default razorpay;
