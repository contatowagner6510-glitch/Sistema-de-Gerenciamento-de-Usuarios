const { DELETE } = require("sequelize/lib/query-types");
const {User} = require("../models/index");

const usersController = {
// =============================================================== CREATE// CRIAR
   async create(req, res) {
  try {
        // lê o json do body e pega os dados
    const {nome, email, telefone} = req.body;

        //validação
        if(!nome||!email||!telefone){
            return res.status(400).json({
                mensagem:"todos os dados são obrigatórios."
            })
        }
        //criando usuario //await variavel const do MODELS com os campos
        const userCreate = await User.create({
            nome,
            email,
            telefone
        })
        return res.status(201).json('UserCriado')

    //capitando erros
  } catch (error) {
    console.error("ERRO: ",error);
    return res.status(500).json({ mensagem: 'Erro ao criar usuário'})
  }

   },

   //======================================================= FIND ALL// LISTAR TODOS
   async findAll(req, res,  ) { 
  try {
        //procurando usuarios 
        const userFindAll = await User.findAll({include : 'tasks'})

        //validação caso não haja usuarios
        if(!userFindAll||!userFindAll.length ===0){
            return res.status(400).json({
                mensagem:"Nenhum usuario encontrado"
            })
        }

       return res.status(200).json({
      mensagem: "Resultados encontrados", dados: userFindAll

      //em caso de erro
    });} catch (error) {
    console.error("ERRO: ",error);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuarios'})
  }
   },

    //======================================================= FIND BY ID // ENCONTRAR PELO ID
async findByID(req, res) {
  try {
    console.log('params:', req.params);
    const { id } = req.params;

    // busca pelo ID
    const user = await User.findByPk(id);

    // validação
    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    return res.status(200).json({
      mensagem: "Usuário encontrado",
      dados: user
    });

  } catch (error) {
    console.error("ERRO: ", error);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuário"
    });
  }
},

   
   //======================================================= UPDATE // ATUALIZAR
   async update(req, res) {
  try {
        //editar usuario //await variavel const do MODELS com os campos
        
        //recebe id pela rota
        console.log('params:', req.params);
        const {id} = req.params
        
        //recebe dados pelo body
        const {nome, email, telefone}= req.body

        //validação
        if(!nome || !email || !telefone){
            return res.status(400).json({
                mensagem:" campos obrigatórios"
            })
        }

       //verifica se o usuario existe
        const user= await User.findByPk(id)
        if(!user){
            return res.status(400).json({
                mensagem:" usuario não encontrado"
            })
        }

        await user.update({nome, email, telefone})


       return res.status(200).json({
      mensagem: "usuario atualizado"
        });}
          //em caso de erro
        catch (error) {
        console.error("ERRO: ",error);
         return res.status(500).json({ mensagem: 'Erro ao atualizar usuario'})
    }
   },


   //======================================================= DELETE // DELETAR
   async delete(req, res) {
  try {
        
        //recebe id pela rota
        console.log('params:', req.params);
        const {id} = req.params
        
       
      

       //verifica se o usuario existe
        const user= await User.findByPk(id)
        if(!user){
            return res.status(404).json({
                mensagem:" usuario não encontrado"
            })
        }

        await user.destroy(User)


       return res.status(200).json({
      mensagem: "usuario deletado"
        });}
          //em caso de erro
        catch (error) {
        console.error("ERRO: ",error);
         return res.status(500).json({ mensagem: 'Erro ao deletar usuario'})
    }
   },


}
console.log('User model:', User);


module.exports = usersController
