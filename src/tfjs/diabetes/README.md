## Model Testing

- **Healthy >> [0.00568393]** <br>
print("The result should be between 0 and 0.5 ( Healthy / Low Risk Diabetes ):") <br>
model.predict([[1.0, 1.0, 22.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0]])

- **Not Healthy >> [0.7104426]** <br>
print("The result should be between 0.5 and 1 ( Unhealthy / High Risk Diabetes ):") <br>
model.predict([[1.0, 5.0, 85.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0]])



## Dataset

- **Target**
  - diabetes [0,1] = [Tidak, Ya]

- **Features**
  - kelamin [0,1] = [Perempuan, Lakilaki]
  - umur [0,1, .. ,11,12] = ['18-24', '25-29', .. , '75-79', '80 or older']
  - bmi [float]
  - tekananDarah [0,1] = [Normal, Tinggi]
  - kolesterol [0,1] = [Normal, Tinggi]
  - stroke [0,1] = [Tidak, Ya]
  - sakitJantung [0,1,2] = [Tidak, Prediabetes, Ya]
  - rokok [0,1] = [Tidak, Ya]
  - alkohol [0,1] = [Tidak, Ya]
  - olahraga [0,1] = [Tidak, Ya]
  - buah [0,1] = [Tidak, Ya]
  - sayur [0,1] = [Tidak, Ya]
  - susahJalan [0,1] = [Tidak, Ya]
