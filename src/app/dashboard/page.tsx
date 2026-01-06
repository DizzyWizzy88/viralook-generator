"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { UniversalInput } from "@/components/UniversalInput";
import { db } from "@/lib/firebase"; 
import { doc, onSnapshot, collection, query, where, orderBy } from "firebase/firestore";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Summoning the AI gods...");
  const [credits, setCredits] = useState<number | string>("...");
  const [gallery, setGallery] = useState<any[]>([]);

  const deviceId = "user_dev_01"; 
  const STRIPE_IDS = {
    PRO: "price_1SlG310ZcMLctEm4DPIgTkyR",
    LEGEND: "price_1SlG4r0ZcMLctEm4Nyh0rswZ" 
  };

  const loadingPhrases = [
    "Summoning the AI gods...",
    "Stitching digital fabrics...",
    "Rendering your vision...",
    "Consulting the fashion oracles...",
    "Polishing the pixels...",
    "Downloading style data..."
  ];

  useEffect(() => {
    const unsubCredits = onSnapshot(doc(db, "users", deviceId), (doc) => {
      if (doc.exists()) setCredits(doc.data().credits);
      else setCredits(5);
    });

    const q = query(
      collection(db, "generations"),
      where("userId", "==", deviceId),
      orderBy("createdAt", "desc")
    );
    const unsubGallery = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(images);
    });

    return () => { unsubCredits(); unsubGallery(); };
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    // Cycle through messages while waiting
    const messageInterval = setInterval(() => {
      setLoadingMessage(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
    }, 3000);

    try {
      // Your existing generation logic would go here
      // For now, we simulate a delay
      await new Promise(resolve => setTimeout(resolve, 8000));
    } finally {
      clearInterval(messageInterval);
      setIsLoading(false);
      setPrompt("");
    }
  };

  const handlePurchase = async (planType: string, priceId: string) => {
    setIsSubscribing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planType, deviceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error", err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Viralook_${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (url: string, promptText: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Viralook AI Creation',
          text: `Check out this design: "${promptText}"`,
          url: url,
        });
      } catch (err) { console.log('Share failed'); }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: '/Viralook.png' }} style={styles.mainLogo} resizeMode="contain" />
          <View style={styles.brandInfo}>
            <Text style={styles.brandTitle}>VIRALOOK</Text>
            <Text style={styles.brandSubtitle}>AI STUDIO</Text>
          </View>
        </View>
        <View style={styles.creditPill}>
          <Text style={styles.creditValue}>{credits}</Text>
          <Text style={styles.creditLabel}>CREDITS</Text>
        </View>
      </View>

      {/* PRICING */}
      <View style={styles.pricingSection}>
        <View style={styles.card}>
          <Text style={styles.planLabel}>STARTER</Text>
          <Text style={styles.planPrice}>$0</Text>
          <View style={styles.currentPlanBadge}><Text style={styles.badgeText}>CURRENT</Text></View>
        </View>
        <View style={[styles.card, styles.highlightCard]}>
          <View style={styles.popularTag}><Text style={styles.popularText}>POPULAR</Text></View>
          <Text style={[styles.planLabel, { color: '#00d2ff' }]}>PRO</Text>
          <Text style={styles.planPrice}>$19.99</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handlePurchase("pro", STRIPE_IDS.PRO)}>
            <Text style={styles.buttonText}>{isSubscribing ? "..." : "UPGRADE"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.planLabel}>LEGEND</Text>
          <Text style={styles.planPrice}>$39.99</Text>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#1a1a1a' }]} onPress={() => handlePurchase("viral_legend", STRIPE_IDS.LEGEND)}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>GO LEGEND</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GENERATOR WITH LOADING STATE */}
      <View style={styles.studio}>
        <UniversalInput 
          placeholder="Describe your vision..." 
          value={prompt} 
          onChangeText={setPrompt} 
          style={styles.textInput}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.generateBtn, isLoading && styles.disabledBtn]} 
          onPress={handleGenerate} 
          disabled={isLoading}
          activeOpacity={0.8}
        >
           {isLoading ? (
             <View style={styles.loadingRow}>
               <ActivityIndicator color="#000" />
               <Text style={styles.generateBtnText}>{loadingMessage}</Text>
             </View>
           ) : (
             <Text style={styles.generateBtnText}>CREATE VISUAL</Text>
           )}
        </TouchableOpacity>
      </View>

      {/* GALLERY */}
      <View style={styles.galleryWrapper}>
        <Text style={styles.galleryTitle}>EXPLORE CREATIONS</Text>
        <View style={styles.gridContainer}>
            {gallery.map((item) => (
                <View key={item.id} style={styles.galleryCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} />
                    <View style={styles.imageOverlay}>
                        <View style={styles.actionRow}>
                          <TouchableOpacity style={styles.downloadCircle} onPress={() => downloadImage(item.imageUrl, item.id)}>
                              <Text style={styles.iconText}>↓</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.downloadCircle, { backgroundColor: '#fff' }]} onPress={() => shareImage(item.imageUrl, item.prompt)}>
                              <Text style={[styles.iconText, { fontSize: 14 }]}>↗</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.imagePrompt} numberOfLines={1}>{item.prompt}</Text>
                    </View>
                </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  container: { padding: 20, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1000, padding: 20, backgroundColor: '#050505', borderRadius: 30, borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  mainLogo: { width: 50, height: 50, marginRight: 12 },
  brandInfo: { justifyContent: 'center' },
  brandTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  brandSubtitle: { color: '#00d2ff', fontSize: 9, fontWeight: '700', letterSpacing: 3 },
  creditPill: { backgroundColor: '#00d2ff15', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, alignItems: 'center' },
  creditValue: { color: '#00d2ff', fontSize: 16, fontWeight: '900' },
  creditLabel: { color: '#00d2ff', fontSize: 7, fontWeight: 'bold' },
  pricingSection: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 },
  card: { backgroundColor: '#050505', padding: 20, borderRadius: 25, width: 240, borderWidth: 1, borderColor: '#1a1a1a' },
  highlightCard: { borderColor: '#00d2ff', backgroundColor: '#000810' },
  popularTag: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: '#00d2ff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 },
  popularText: { color: '#000', fontSize: 8, fontWeight: '900' },
  planLabel: { color: '#444', fontSize: 10, fontWeight: '900', marginBottom: 4 },
  planPrice: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  actionButton: { backgroundColor: '#00d2ff', padding: 12, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 11 },
  currentPlanBadge: { padding: 10, backgroundColor: '#111', borderRadius: 12, alignItems: 'center' },
  badgeText: { color: '#444', fontSize: 9, fontWeight: 'bold' },
  studio: { width: '100%', maxWidth: 600, gap: 15, marginBottom: 50 },
  textInput: { backgroundColor: '#080808', color: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  generateBtn: { backgroundColor: '#fff', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { opacity: 0.7 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  generateBtnText: { color: '#000', fontWeight: '900' },
  galleryWrapper: { width: '100%', maxWidth: 1000 },
  galleryTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
  galleryCard: { width: 220, height: 220, borderRadius: 15, overflow: 'hidden', backgroundColor: '#050505', borderWidth: 1, borderColor: '#1a1a1a' },
  galleryImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.8)', padding: 10 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 5 },
  downloadCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#00d2ff', justifyContent: 'center', alignItems: 'center' },
  iconText: { color: '#000', fontSize: 20, fontWeight: '900' },
  imagePrompt: { color: '#fff', fontSize: 10, opacity: 0.8 }
});
