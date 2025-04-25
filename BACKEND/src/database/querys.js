export const queries = {
  // getJugadoresByNombrePass: 'SELECT * FROM jugadores WHERE nombre = @nombre AND password = @password',
  getLogin: "SELECT * FROM jugadores WHERE password = @clave AND nombre = @usuario",
  //updatePlayer: 'UPDATE jugadores SET ico = ico + @ico WHERE id = @id',
  //updatePlayer: `UPDATE jugadores SET ico = @ico OUTPUT inserted.ico WHERE id = @id`
  updatePlayer: `UPDATE jugadores SET ico = @ico, Perdidas = Perdidas + @Perdidas,  Ganadas = Ganadas + @Ganadas, Empatadas = Empatadas + @Empatadas  WHERE id = @id`,
  //getRanking: 'SELECT * FROM jugadores ORDER BY ICO DESC',
  getRanking:'SELECT ROW_NUMBER() OVER (ORDER BY ICO DESC) AS Posicion, * FROM jugadores ORDER BY   ICO DESC',

  getJugadorById: 'SELECT * FROM jugadores WHERE ID = @id',

  UpdateViewAvisoById: 'UPDATE jugadores SET ViewAviso = 0 WHERE ID = @id',

}
