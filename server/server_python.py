import socket
from parser import receive_paquet

host= '172.20.10.10'
port=12345

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))

server_socket.listen(5)

print("Attente de connexion...")


while (True):
    client_socket, addr = server_socket.accept()

    print("Connexion établie avec ", addr)
    data = client_socket.recv(1024)
    receive_paquet(addr, data)
    print(f"Reçu de {addr[0]}")



    if not data:
        break


client_socket.close()
server_socket.close()