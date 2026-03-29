import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params ?? {}
  const {
    name,
    category,
    prepTime,
    difficulty,
    ingredients = [],
    steps = [],
    emoji = "🍽️",
  } = recipe ?? {}
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      title: name ? name : "Detalle de receta",
    })
  }, [navigation, name])

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-center text-base text-slate-200">No hay receta seleccionada.</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-slate-950 px-4 pt-6">
      <Text className="text-3xl font-black text-cyan-200">
        {emoji} {name}
      </Text>
      <Text className="mt-2 text-base text-slate-300">Categoria: {category}</Text>
      <Text className="mt-1 text-base text-slate-300">Tiempo de preparacion: {prepTime}</Text>
      <Text className="mt-1 text-base text-slate-300">Dificultad: {difficulty}</Text>

      <TouchableOpacity
        className="mt-4 w-48 rounded-xl bg-cyan-600 px-4 py-3"
        onPress={() => setIsFavorite((prev) => !prev)}
      >
        <Text className="text-center font-semibold text-slate-950">
          {isFavorite ? "Favorita: Si" : "Marcar como favorita"}
        </Text>
      </TouchableOpacity>

      <View className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-4">
        <Text className="text-lg font-bold text-cyan-200">Ingredientes</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} className="mt-1 text-base text-slate-300">- {ingredient}</Text>
        ))}
      </View>

      <View className="mt-4 rounded-3xl border border-slate-700 bg-slate-900 p-4">
        <Text className="text-lg font-bold text-cyan-200">Pasos</Text>
        {steps.map((step, index) => (
          <Text key={index} className="mt-1 text-base text-slate-300">{index + 1}. {step}</Text>
        ))}
      </View>
    </View>
  )

}

export default RecipeDetailScreen