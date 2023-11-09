import { useEffect, useState } from 'react'
import { RecipeType } from './types/recipe.type'
import axios from 'axios'
import DeletModal from '../deleteModal/deleteModal'

interface Recipe {
  recipe: RecipeType
}

async function getLikes(recipeId: string) {
  try {
    return await axios.get('/api/recipe/' + recipeId + '/favoritesQuantity')
  } catch (error) {
    alert(error)
  }
}

async function getRating(recipeId: string) {
  try {
    return await axios.get('/api/recipe/' + recipeId + '/rating')
  } catch (error) {
    alert(error)
  }
}

async function getComments(recipeId: string) {
  try {
    return await axios.get('/api/recipe/' + recipeId + '/commentsQuantity')
  } catch (error) {
    alert(error)
  }
}

function RecipeCard({ recipe }: Recipe) {
  const [likes, setLikes] = useState<number>(0)
  const [rating, setRating] = useState<number>(0)
  const [comments, setComments] = useState<number>(0)
  const [openModalEdit, setOpenModalEdit] = useState<undefined | boolean>(undefined)
  const [openModalDelete, setOpenModalDelete] = useState<undefined | boolean>(undefined)

  useEffect(() => {
    if (recipe.publicado) {
      getLikes(recipe.id).then((data) => {
        if (data) setLikes(data.data)
      })
      getRating(recipe.id).then((data) => {
        if (data) setRating(data.data)
      })
      getComments(recipe.id).then((data) => {
        if (data) setComments(data.data)
      })
    }
  }, [recipe.id, recipe.publicado, openModalDelete])

  const handleSetOpenModalEdit = (value: boolean | undefined) => {
    setOpenModalEdit(value)
  }

  const handleSetOpenModalDelete = (value: boolean | undefined) => {
    setOpenModalDelete(value)
  }

  return (
    <>
      <div className="m-2 w-full p-4 md:w-2/3 lg:w-2/3">
        <img
          src={recipe.imagem}
          alt={recipe.titulo}
          className="h-48 w-full object-cover"
        />
          <h2 className="mt-2 text-xl font-bold text-orange-600">
            {recipe.titulo}
          </h2>
        <p className="uppercase text-gray-400">{recipe.subtitulo}</p>
        <p className="mb-2 flex items-center">
          {' '}
          <i className="far fa-clock mr-1 text-gray-400"></i>{' '}
          {recipe.tempo_preparo}
        </p>
        <p className="text-gray-400">{recipe.descricao}</p>
        <div className="mt-2 flex justify-between space-x-4">
          <div className='flex'>
            {' '}
            <span className="flex items-center">
              <i className="far fa-heart mr-1 text-red-500"></i>{' '}
              <span>{likes}</span>
            </span>
            <span className="flex items-center">
              <i className="far fa-comment mr-1 text-black"></i>{' '}
              <span>{comments}</span>
            </span>
            <span className="flex items-center">
              <i className="far fa-star mr-1 text-yellow-500"></i>{' '}
              <span>{rating}</span>
            </span>
          </div>
          <div>
            <i className="fa-solid fa-pen-to-square cursor-pointer" style={{color: "#ff8c00"}} onClick={() => {handleSetOpenModalEdit(true)}}></i>
            <i className="fa-solid fa-trash-can cursor-pointer"  style={{color: "#ff8c00"}} onClick={() => {handleSetOpenModalDelete(true)}}></i>
          </div>
        </div>
      </div>
      {openModalDelete === true && (
        <DeletModal
          show={openModalDelete}
          setOpenModalDelete={handleSetOpenModalDelete}
          id={recipe.id}
        />
      )}
  </>
  )
}

export default RecipeCard
