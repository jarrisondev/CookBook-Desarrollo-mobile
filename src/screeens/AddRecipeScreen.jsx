import { useEffect, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const AddRecipeScreen = () => {
  const [recipeName, setRecipeName] = useState("")
  const [category, setCategory] = useState("")
  const [preparationTime, setPreparationTime] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    // Real-time validation to enable/disable the save button.
    const hasRequiredFields =
      recipeName.trim().length > 0 &&
      category.trim().length > 0 &&
      preparationTime.trim().length > 0 &&
      difficulty.trim().length > 0 &&
      ingredients.trim().length > 0

    setIsFormValid(hasRequiredFields)
  }, [recipeName, category, preparationTime, difficulty, ingredients])

  const clearForm = () => {
    setRecipeName("")
    setCategory("")
    setPreparationTime("")
    setDifficulty("")
    setIngredients("")
  }

  const handleSaveRecipe = () => {
    Alert.alert(
      "Receta guardada",
      `Nombre: ${recipeName}\nCategoria: ${category}\nTiempo de preparacion: ${preparationTime} minutos\nDificultad: ${difficulty}\nIngredientes: ${ingredients}`,
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-1 text-3xl font-black text-cyan-300">Nueva Receta</Text>
        <Text className="mb-5 text-sm text-slate-300">Completa los campos para registrar tu receta.</Text>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-200">Nombre de la receta</Text>
          <TextInput
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
            placeholder="Ej: Lasaña casera"
            placeholderTextColor="#94a3b8"
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-200">Categoria</Text>
          <TextInput
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
            placeholder="Postre, entrada, plato fuerte, bebida"
            placeholderTextColor="#94a3b8"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-200">Tiempo de preparacion (minutos)</Text>
          <TextInput
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
            placeholder="Ej: 45"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={preparationTime}
            onChangeText={setPreparationTime}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-slate-200">Dificultad</Text>
          <TextInput
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
            placeholder="Fácil, media o difícil"
            placeholderTextColor="#94a3b8"
            value={difficulty}
            onChangeText={setDifficulty}
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-semibold text-slate-200">Ingredientes principales</Text>
          <TextInput
            className="min-h-24 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
            placeholder="Ej: Harina, huevos, leche, mantequilla"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={ingredients}
            onChangeText={setIngredients}
          />
        </View>

        <TouchableOpacity
          className={`mb-3 rounded-2xl px-4 py-3 ${isFormValid ? "bg-cyan-500" : "bg-slate-700"}`}
          disabled={!isFormValid}
          onPress={handleSaveRecipe}
        >
          <Text className="text-center text-base font-semibold text-slate-950">Guardar Receta</Text>
        </TouchableOpacity>

        <TouchableOpacity className="rounded-2xl border border-cyan-700 bg-slate-900 px-4 py-3" onPress={clearForm}>
          <Text className="text-center text-base font-semibold text-cyan-300">Limpiar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AddRecipeScreen
