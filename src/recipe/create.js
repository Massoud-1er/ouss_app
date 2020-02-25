import { Recipe } from '../schema/recipe'

export async function create (req, res) {
  try {
    // req.body.publisher_id = req.session.user._id
    await new Recipe(req.body).save()
    res.send({ message: 'success' })
  } catch (e) { console.log(e) }
}
