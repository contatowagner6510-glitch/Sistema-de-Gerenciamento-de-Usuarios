const { DELETE } = require("sequelize/lib/query-types");
const {Task, User} = require("../models/index");

const TaskController = {
    // =============================================================== CREATE// CRIAR
   async create(req, res) {
  try {
    const { nome, descricao, concluida, prazo, userId } = req.body;

    if (!nome || !descricao || !prazo || userId === undefined) {
      return res.status(400).json({
        mensagem: "Todos os dados são obrigatórios."
      });
    }

    const task = await Task.create({
      nome,
      descricao,
      concluida,
      prazo,
      userId
    });

    return res.status(201).json(task);

  } catch (error) {
    console.error("ERRO AO CRIAR TASK:", error);
    return res.status(500).json({ mensagem: 'Erro ao criar tarefa' });
  }
},


    //======================================================= FIND ALL// LISTAR TODOS
    async findAll(req, res) {
        try {
            //procurando usuarios 
            const TaskFindAll = await Task.findAll()

            //validação caso não haja usuarios
            if (!TaskFindAll || !TaskFindAll.length === 0) {
                return res.status(400).json({
                    mensagem: "Nenhuma tarefa encontrada"
                })
            }

            return res.status(200).json({
                mensagem: "Resultados encontrados", dados: TaskFindAll

                //em caso de erro
            });
        } catch (error) {
            console.error("ERRO: ", error);
            return res.status(500).json({ mensagem: 'Erro ao buscar tarefas' })
        }
    },

    //======================================================= FIND BY ID // ENCONTRAR PELO ID
    async findByID(req, res) {
        try {
            //procurando usuarios //await variavel const do MODELS com os campos


            console.log('params:', req.params);
            const { id } = req.params

            //aqui você tem que passar o id como parametro da função findbypk
            const task = await Task.findByPk(id)
            //validação
            if (!task) {
                return res.status(400).json({
                    mensagem: "tarefa não encontrada"
                })
            }

            return res.status(200).json({
                mensagem: "Tarefa encontrada", dados: User
            });
        }
        //em caso de erro
        catch (error) {
            console.error("ERRO: ", error);
            return res.status(500).json({ mensagem: 'Erro ao buscar tarefa' })
        }
    },

    //======================================================= UPDATE // ATUALIZAR
    async update(req, res) {
        try {
            //editar usuario //await variavel const do MODELS com os campos

            //recebe id pela rota
            console.log('params:', req.params);
            const { id } = req.params

            //recebe dados pelo body
            const { nome, descricao, concluida, prazo } = req.body

            //validação
            if (!nome   || !prazo) {
                return res.status(400).json({
                    mensagem: " nome e prazo são campos obrigatórios"
                })
            }

            //verifica se o usuario existe
            const task = await Task.findByPk(id)
            if (!task) {
                return res.status(400).json({
                    mensagem: " tarefa não encontrada"
                })
            }

            await task.update({ nome, descricao, concluida, prazo })


            return res.status(200).json({
                mensagem: "tarefa atualizada"
            });
        }
        //em caso de erro
        catch (error) {
            console.error("ERRO: ", error);
            return res.status(500).json({ mensagem: 'Erro ao atualizar tarefa' })
        }
    },

//======================================================= DELETE // DELETAR
    async delete(req, res) {
  try {
        
        //recebe id pela rota
        console.log('params:', req.params);
        const {id} = req.params
        
       
      

       //verifica se o usuario existe
        const task= await Task.findByPk(id)
        if(!task){
            return res.status(404).json({
                mensagem:" Tarefa não encontrada"
            })
        }

        await task.destroy(Task)


       return res.status(200).json({
      mensagem: "tarefa deletada"
        });}
          //em caso de erro
        catch (error) {
        console.error("ERRO: ",error);
         return res.status(500).json({ mensagem: 'Erro ao deletar usuario'})
    }
   },








}

module.exports = TaskController