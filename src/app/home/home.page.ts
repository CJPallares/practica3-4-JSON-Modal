import { Component, OnInit } from '@angular/core';
import { ApiServiceProvider } from 'src/providers/api-service/api-service';
import { Alumno } from '../modelo/Alumno';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EditarAlumnoPage } from '../editar-alumno/editar-alumno.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public alumnos = new Array<Alumno>();

  constructor(private apiService: ApiServiceProvider, public alertController: AlertController,
    public modalController: ModalController, public toastController: ToastController) {
  }

  /* cuando se carga la pantalla se llama al método getAlumnos de la Api. Este es un método asíncrono que devuelve un objeto Promise del que debe ser evaluado el resultado.
    Si el acceso a la Api ha ido bien se ejecuta el código asociado a la cláusula then.  Símplemente se coge el array de alumnos que llega y se asocia a él el atributo alumnos de la clase.
    Si ha ido mal el acceso (por ejemplo si no hemos lanzado jsonServer) se coge el error que llega y se muestra por consola. */

  ngOnInit(): void {
    this.apiService.getAlumnos()
      .then((alumnos: Alumno[]) => {
        this.alumnos = alumnos;
        console.log(this.alumnos);
      })
      .catch((error: string) => {
        console.log(error);
      });
  }



  /* este método llama al método eliminarAlumno de la Api y le pasa el id del alumno a eliminar. Se devuelve un objeto Promise. Si el borrado ha ido bien se ejecuta el código asociado a la cláusula then. Símplemente se muestra por consola un mensaje y se elimina el alumno del array de alumnos de la clase, lo que hará que deje de verse en la vista.
  Si el borrado ha ido mal muestro por consola el error que ha ocurrido.
  */

  eliminarAlumno(indice: number) {
    this.apiService.eliminarAlumno(this.alumnos[indice].id)
      .then((correcto: boolean) => {
        console.log("Borrado correcto del alumno con indice: " + indice);
        this.alumnos.splice(indice, 1);
      })
      .catch((error: string) => {
        console.log("Error al borrar: " + error);
      });
  }//end_eliminar_alumno

  /* A continuación pondremos para cada fila de la lista un botón que al ser pulsado mostrará en una
   ventana emergente todos los datos del alumno en cajas de texto para permitir su modificación.
    Al método se le pasará como parámetro el índice del alumno que se va a modificar. */
  async modificarAlumno(indice: number) {
    const modal = await this.modalController.create({
      component: EditarAlumnoPage,
      componentProps: {
        'alumnoJson': JSON.stringify(this.alumnos[indice])
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data['data'] != null) {
        let alumnoJSON = JSON.parse(data['data']);
        let alumnoModificado: Alumno = Alumno.createFromJsonObject(alumnoJSON);
        this.apiService.modificarAlumno(alumnoModificado.id, alumnoModificado)  //se hace PUT a la API
          .then((alumno: Alumno) => {
            this.alumnos[indice] = alumno;  //si se ha modificado en la api se actualiza en la lista
          })
          .catch((error: string) => {
            console.log(error);
          });
      }
    });

    return await modal.present();
  } //end_modificarAlumno

  async nuevoAlumno() {

    const modal = await this.modalController.create({

      component: EditarAlumnoPage,

      componentProps: {

        'alumnoJson': JSON.stringify(new Alumno(-1,

          "", "", "", "", "", "", "", ""))

      }

    });

    modal.onDidDismiss().then((data) => {

      if (data['data'] != null) {

        let alumnoJSON = JSON.parse(data['data']);

        let alumnoNuevo: Alumno = Alumno.createFromJsonObject(alumnoJSON);

        this.apiService.insertarAlumno(alumnoNuevo)  //se hace POST a la API

          .then((alumno: Alumno) => {

            this.alumnos.push(alumno);  //si se ha insertado en la api se añade en la lista

          })

          .catch((error: string) => {

            this.presentToast("Error al insertar: " + error);

          });

      }

    });

    return await modal.present();

  } //end_nuevoAlumno

// Debemos también implementar el método presenToast. Este método hace uso de un atributo ToastController 
// injectado en el constructor.
  async presentToast(message: string) {

    const toast = await this.toastController.create({

      message: message,

      duration: 2000

    });

    toast.present();

  }

}//end_class