import numpy as np

from keras.datasets import mnist
from PIL import Image

(train_X, train_y), (test_X, test_y) = mnist.load_data()

print('X_train: ' + str(train_X.shape))
print('Y_train: ' + str(train_y.shape))
print('X_test:  ' + str(test_X.shape))
print('Y_test:  ' + str(test_y.shape))

flat_x = np.hstack(train_X[0])
print(flat_x.shape)

num_labels = 10
hidden_size = batch_size = 10

iter = 5

def img_to_array():
    img_path = r"C:\Users\chern\PycharmProjects\jsPractice\net\images\number1.jpg"
    img = Image.open(img_path).convert("1").resize((28, 28))
    img_arr = np.array(img, dtype='float32')
    # img.save(r"C:\Users\chern\PycharmProjects\jsPractice\net\images\number1_c.jpg")
    return img_arr

def softmax(x, axis=1):
    temp = np.exp(x)
    return temp / np.sum(temp, axis=axis, keepdims=True)


class Net:
    def __init__(self):
        self.weights = 2*np.random.random((784, num_labels)) - 1

    def feedforfard(self, input, axis=1):
        out = softmax(np.dot(input, self.weights), axis)
        return out

    def change_weights(self, diff, input_data):
        self.weights = self.weights + (input_data.T.dot(diff)/batch_size)


images = train_X[0:1000].reshape(1000, 28*28)/255
labels = train_y[0:1000]
print(f"images [0] {images[0]} \n {type(images[0])}")
new_labels = np.zeros((len(labels), 10))
for i, j in enumerate(labels):
    new_labels[i][j] = 1
labels = new_labels
net_obj = Net()

for i in range(iter):
    error = 0
    correct_count = 0
    all_count = 0
    for j in range(int(len(images)/batch_size)):
         input_data = images[j*batch_size:(j+1)*batch_size]
         labels_for_batch = labels[j*batch_size:(j+1)*batch_size]
         predict = net_obj.feedforfard(input_data)
        # print(f"predict {predict.shape}")
        # print(f"predict {[float(k) for k in sorted(predict[0])]}")

         error += np.sum((labels_for_batch - predict) ** 2)
         for k in range(batch_size):
           #  print(f"predict k {np.argmax(predict[k])} ")
           #  print(f"labels_for_batch k{np.argmax(labels_for_batch[k])}")
             if np.argmax(predict[k]) == np.argmax(labels_for_batch[k]):
                 correct_count += 1
             all_count += 1
             diff = labels_for_batch - predict
             net_obj.change_weights(diff, input_data)
        # print(f"labels_for_batch.shape {labels_for_batch.shape}")
        # print(f"diff[0] {diff[0]}")
    print(f"LOG iter{i}  error {error}  correct_count {correct_count}  all_count {all_count}")

images_test = test_X[0:10].reshape(10, 28*28)/255
labels_test = test_y[0:10]
new_labels_test = np.zeros((len(labels_test), 10))
for i, j in enumerate(labels_test):
    new_labels_test[i][j] = 1
labels_test = new_labels

correct_count_test = 0
all_count_test = 0
for i in range(len(images_test)):
    input_data_test = images_test[i]
    predict = net_obj.feedforfard(input_data_test, axis=0)
    if np.argmax(predict) == np.argmax(new_labels_test[i]):
        print(f"iter {i}  np.argmax(predict) {np.argmax(predict)}---{np.argmax(new_labels_test[i])}  ")
        correct_count_test += 1
    all_count_test += 1
print(f"correct_count_test {correct_count_test}  all_count_test {all_count_test}")

