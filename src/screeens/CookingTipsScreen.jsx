import { useEffect, useState } from "react"
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { COOKING_TIPS } from "../mockdata/cookingTipsData"

const MAX_TIPS = COOKING_TIPS.length

const CookingTipsScreen = () => {
  const [tips] = useState(COOKING_TIPS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MAX_TIPS)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setProgressLabel(`Tip ${currentIndex + 1} de ${MAX_TIPS}`)
  }, [currentIndex])

  const handleNextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % MAX_TIPS)
  }

  const currentTip = tips[currentIndex]

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-1 text-3xl font-black text-cyan-300">Consejos</Text>
        <Text className="mb-6 text-sm text-slate-300">
          Aprende técnicas y trucos para cocinar mejor.
        </Text>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-widest text-cyan-500">
            {progressLabel}
          </Text>
          <View className="flex-row gap-1">
            {tips.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === currentIndex
                    ? "w-5 bg-cyan-400"
                    : "w-2 bg-slate-700"
                }`}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 rounded-3xl border border-cyan-900 bg-slate-900 p-6">
          <Text className="mb-4 text-5xl">{currentTip.emoji}</Text>
          <Text className="mb-3 text-2xl font-bold text-cyan-200">
            {currentTip.title}
          </Text>
          <Text className="text-base leading-7 text-slate-300">
            {currentTip.body}
          </Text>
        </View>

        <TouchableOpacity
          className="mb-4 mt-6 items-center rounded-2xl bg-cyan-500 py-4"
          onPress={handleNextTip}
          activeOpacity={0.8}
        >
          <Text className="text-base font-bold text-slate-950">
            Siguiente tip →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CookingTipsScreen
