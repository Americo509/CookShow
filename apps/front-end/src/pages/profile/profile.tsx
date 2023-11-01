import { useEffect, useState } from 'react'
import RecipeCard from './recipeCard'
import UserProfile from './userProfile'
import axios from 'axios'
import { RecipeType } from './types/recipe.type'
import { Backdrop, CircularProgress } from '@mui/material'

async function getRecipesCreatedByUser(userId: string) {
  try {
    return await axios.get('/api/recipe/user/' + userId)
  } catch (error) {
    alert(error)
  }
}

async function getFavoritesRecipesUser(userId: string) {
  try {
    return await axios.get('/api/recipe/user/' + userId + '/favorites')
  } catch (error) {
    alert(error)
  }
}

async function getPayloadUser(token: string) {
  try {
    console.log(token)
    return await axios.get('/api/auth/' + token)
  } catch (error) {
    alert(error)
  }
}

const token =
  localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken')

function ProfilePage() {
  const [showPublicacoes, setShowPublicacoes] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [receitas, setReceitas] = useState<RecipeType[]>([])
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    if (token)
      getPayloadUser(token).then((payload) => {
        console.log(payload)
        if (payload) setUserId(payload.data.sub)
      })
    else alert('Usuário não logado')
  }, [])

  useEffect(() => {
    if (showPublicacoes) {
      setIsLoading(true)
      getRecipesCreatedByUser(userId).then((data) => {
        if (data) setReceitas(data.data)
        setIsLoading(false)
      })
    } else {
      setIsLoading(true)
      getFavoritesRecipesUser(userId).then((data) => {
        if (data) setReceitas(data.data)
        setIsLoading(false)
      })
    }
  }, [, showPublicacoes])

  const handleShowPublicacoes = async () => {
    setShowPublicacoes(true)
  }

  const handleShowFavoritos = async () => {
    setShowPublicacoes(false)
  }

  return (
    <div className="flex h-[90vh] flex-col md:flex-row">
      <div className="max-h-[40vh] w-full md:max-h-full md:w-1/4 lg:w-1/3 xl:w-1/4  ">
        <UserProfile />
      </div>
      <div className="relative w-full bg-white p-4 md:w-3/4 lg:w-2/3 xl:w-3/4">
        <div className="mx-auto mb-4 flex max-w-md justify-between md:max-w-lg lg:max-w-2xl">
          <div
            className={`flex cursor-pointer items-center space-x-2 ${
              showPublicacoes ? 'text-orange-500' : ''
            }`}
            onClick={handleShowPublicacoes}
          >
            <i className="fas fa-newspaper text-2xl"></i>
            <span>Publicações</span>
          </div>
          <div
            className={`flex cursor-pointer items-center space-x-2 ${
              !showPublicacoes ? 'text-orange-500' : ''
            }`}
            onClick={handleShowFavoritos}
          >
            <i className="far fa-heart text-2xl"></i>
            <span>Favoritos</span>
          </div>
        </div>

        <div className="flex h-full max-h-[50vh] flex-col overflow-y-auto overflow-x-hidden md:max-h-[80vh]">
          <div className="grid w-full  grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {receitas && receitas.length > 0 ? (
              receitas.map((recipe: RecipeType) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center">
                {isLoading ? (
                  <Backdrop
                    sx={{
                      color: '#fff',
                    }}
                    open
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                ) : (
                  <>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-orange-600 bg-transparent p-5">
                      <i className="fas fa-plus text-4xl text-orange-500"></i>
                    </div>
                    <div className="text-center text-2xl text-gray-700">
                      <p>Você ainda não publicou nenhuma receita.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
