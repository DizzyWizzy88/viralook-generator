// Inside your POST function in api/generate/route.ts
const userRef = doc(db, "users", userId);
const userSnap = await getDoc(userRef);
const userData = userSnap.data();

const isUnlimited = userData?.isUnlimited === true;
const currentCredits = userData?.credits || 0;

// Allow generation if they have credits OR are unlimited
if (!isUnlimited && currentCredits < 1) {
  return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
}

// ... AI Generation Logic ...

// Only deduct credits if they are NOT unlimited
if (!isUnlimited) {
  await updateDoc(userRef, {
    credits: increment(-1)
  });
}
