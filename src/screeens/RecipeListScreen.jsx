import { useNavigation } from "@react-navigation/native"
import { useContext } from "react"
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native"
import { RecipesContext } from "../context/RecipesContext"

const RecipeListScreen = () => {
  const navigation = useNavigation()
  const {recipes, loading} = useContext(RecipesContext)


  return (
    <View className="flex-1 bg-slate-950 px-4 pt-6">
      <Text className="mb-1 text-3xl font-black text-cyan-300">Recetario</Text>
      <Text className="mb-5 text-sm text-slate-300">Explora y abre una receta para ver su detalle.</Text>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text className="mt-3 text-base text-slate-300">Cargando recetas...</Text>
        </View>
      ) : recipes.length === 0 ? (
        <View className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <Text className="text-base text-slate-200">No hay recetas disponibles. Agrega una nueva.</Text>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={recipes}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View className="h-5" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-3 rounded-3xl border border-cyan-900 bg-slate-900/90 px-4 py-4"
              onPress={() => navigation.navigate("RecipeDetailScreen", { recipe: item })}
            >
              <View>
                <Text className="text-xl font-bold text-cyan-200">
                  {item.emoji} {item.name}
                </Text>
                <Text className="mt-1 text-sm text-slate-300">Categoria: {item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

export default RecipeListScreen