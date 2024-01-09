# Server listening for the packets from the corrupted phones

import socket
import threading 
import os

from parser import receive_packet

host= '172.20.10.10'
port1=12345
port2=12346
nextVideoDevice="0000"

# ------------- SERVER RECEIVING DATA -----------------


def data_server(port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))

    server_socket.listen(5)

    print("Waiting for connections...")


    while (True):
        client_socket, addr = server_socket.accept()

        print("Connection set with ", addr)
        data = client_socket.recv(1024)
        receive_packet(addr, data)
        print(f"Received from {addr[0]}")



        if not data:
            break

    client_socket.close()
    server_socket.close()



# ------------- SERVER RECEIVING VIDEOS -----------------


def handle_client(client_socket):
    with client_socket:
        # Receive the filename and filesize first
        #file_info = client_socket.recv(1024).decode()
        #filename, filesize = file_info.split(',')
        #filename = "received_" + filename
        #filesize = int(filesize)

        # Receive the file contents
        with open("../video/test.mp4", 'wb') as file:
            #bytes_received = 0
            #while bytes_received < filesize:
            #    chunk = client_socket.recv(4096)
            #    if not chunk:
            #        break  # Connection is closed
            #    file.write(chunk)
            #    bytes_received += len(chunk)

            while True:
                # Receive data from the client
                data = client_socket.recv(4096)
                if not data:
                    break  # No more data, exit the loop

                # Write the received data to the file
                file.write(data)

        print(f"Video has been received.")

def video_server(port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(5)
    print(f"Server listening on {host}:{port}")

    while True:
        client_socket, addr = server.accept()
        print(f"Accepted connection from {addr}")
        client_thread = threading.Thread(target=handle_client, args=(client_socket,))
        client_thread.start()


threading.Thread(target=data_server, args=(port1,)).start()
threading.Thread(target=video_server, args=(port2,)).start()
