from flask import Flask, jsonify, render_template,request
from pathlib import Path

from game import Game
from model import TicTacToeModel

path = Path("/here/your/path/file.txt")
print(path.parent.absolute())
app = Flask(__name__, static_folder='static',)  # Для запуска  flask --app web_service run

game = Game()
game.simulateManyGames(1, 100)
ticTacToeModel = TicTacToeModel(9, 3, 100, 32)
ticTacToeModel.train(game.getTrainingHistory())


def find_possible_moves(moves):
    possible_moves = []
    for i in range(len(moves)):
        for j in range(len(moves)):
            if moves[i][j] == 0:
                possible_moves.append([i, j])
    return possible_moves

@app.route('/', methods=['POST'])
def hello():
    input_json = request.get_json(force=True)
    print(input_json)
    print(input_json['data'])
    data = [input_json['data'][0:3], input_json['data'][3:6], input_json['data'][6:9]]
    possible_moves = find_possible_moves(data)
    print(data)
    print(possible_moves)
    prob = ticTacToeModel.predict(data, 2)  #  сделать обозначения X и О одинакоывми в js и py
    best_prob = -1
    best_move = possible_moves[0]
    for move in possible_moves:
        print(move)
        data[move[0]][move[1]] = 1
        prob = ticTacToeModel.predict(data, 2)
        data[move[0]][move[1]] = 0
        if prob > best_prob:
            best_prob = prob
            best_move = move
    return jsonify(f"data:{best_prob, best_move}")


@app.route('/home')
def index():
    return render_template("index.html")
