<template>
    <div>
        <b-alert v-if = "this.response.recordnotfound == true" show dismissible v-on:click="handlerecordnotfound" fade>record not found!</b-alert>
        <b-alert v-if = "this.response.addressnotfound == true" show dismissible v-on:click="handleaddessnotfound" fade>address not found!</b-alert>
        <b-alert v-if = "this.response.addressnotvalid == true" show dismissible v-on:click="handleaddressnotvalid" fade>address not valid!</b-alert>
        <div>
          <h1>{{this.response.statusCode}}</h1>
        </div>
        <div>
          <p>{{this.response.statusMessage}}</p>
        </div>
        <div id="input-group-1">
            <b-form id="request" inline >
                <b-form-select id="method" v-model="request.method" :options="method" required >
                </b-form-select>

                <b-form-input id="url" v-model="request.url" required placeholder="url">
                </b-form-input>
              <b-button v-on:click="handleSubmitForm" id="button" variant="primary">Send</b-button>
            </b-form>
        </div>

        <div v-if = "this.response.id != ''">
          <b-card-group deck>
            <div id="cardsRight">
              <b-card no-body header="URL INFO" >
                <b-list-group>
                  <div id="cardsText" >
                    <b-list-group-item style="max-height: 50px;"><p id = "ptext">DOMAIN: {{this.response.domain}}</p></b-list-group-item>
                    <b-list-group-item style="max-height: 40px;"><p id = "ptext">SCHEME: {{this.response.httpVersion}}</p></b-list-group-item>
                    <b-list-group-item><p id = "ptext">PATH: {{this.response.pathname}}</p></b-list-group-item>
                  </div>
                </b-list-group>
              </b-card>
            </div>

            <template >
              <div id="cards" v-for="item of this.response.redirects" v-bind:key="item.redirectUri" >
                <b-card no-body header="RESPONSE" style="max-height: 100px;">
                  <b-list-group>
                  <div id="cardsText">
                    <b-list-group-item style="max-height: 40px;"><p id = "ptext">RESPONSE: {{ item.statusCode }}</p></b-list-group-item>
                    <b-list-group-item><p id = "ptext">LOCATION: {{ item.redirectUri.replace(/\?.*/,'') }}</p></b-list-group-item>
                  </div>
                  </b-list-group>
                </b-card>
              </div>
            </template>

            <div id="cardsLeft">
              <b-card no-body header="RESPONSE" >
                <b-list-group flush>
                <div id="cardsText">
                  <b-list-group-item style="max-height: 40px;" ><p id = "ptext">RESPONSE: {{this.response.statusCode}} {{this.response.statusMessage}} </p></b-list-group-item>
                  <b-list-group-item><p id = "ptext">DATE: {{this.response.date}}</p></b-list-group-item>

                </div>
                </b-list-group>
              </b-card>
            </div>
          </b-card-group>
        <div>
          <p>SHARE</p>
          <div id="linkbutton"><p>http://localhost:8080/request/{{this.response.id}}</p></div>
        </div>
        </div>
    </div>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        response:{
          id: this.$route.params.id,
          method: '',
          url: '',
          statusCode: '',
          statusMessage: '',
          date: '',
          pathname: '',
          domain: '',
          httpVersion: '',
          redirects: []
        },
        request:{
          method: 'GET',
          url: null,
        },
        method: ['GET','POST', 'PUT', 'DELETE'],
        recordnotfound : false,
        addressnotfound : false,
        addressnotvalid: false

      }
    },

    created () {
      if(this.response.id != null || this.response.id != undefined){
        let apiURL = 'http://localhost:3000/request/'+this.$route.params.id;
        axios.get(apiURL)
        .then(response => (
                this.response.id = response.data.id,
                this.response.method = response.data.method,
                this.response.url = response.data.url,
                this.response.statusCode =  response.data.statusCode,
                this.response.statusMessage = response.data.statusMessage,
                this.response.date =  response.data.date,
                this.response.redirects = response.data.redirects,
                this.response.pathname = response.data.pathname,
                this.response.domain = response.data.domain,
                this.response.httpVersion = response.data.httpVersion,
                this.request.method = response.data.method,
                this.request.url = response.data.url
          )
        )
        .catch(error => {
            console.log(error.response.status)
            if(error.response.status === 404){
              this.response.id = '',
              this.response.method = '',
              this.response.url = '',
              this.response.statusCode =  '',
              this.response.statusMessage = '',
              this.response.date =  '',
              this.response.redirects = '',
              this.response.pathname = '',
              this.response.domain = '',
              this.response.httpVersion = '',
              this.response.recordnotfound = true,
              window.history.replaceState( {} , {}, "http://localhost:8080/request/" )
            }
            else{
              this.$router.push('/NotWorking')
            }
        });
      }
      else{
        this.response.id = ''
      }
    },

    methods: {
      handlerecordnotfound(){
        this.recordnotfound = false
      },
      handleaddessnotfound(){
        this.addressnotfound = false
      },
      handleaddressnotvalid(){
        this.addressnotvalid = false
      },

      handleSubmitForm() {
        let apiURL = 'http://localhost:3000/request';

        axios.post(apiURL, this.request)
        .then(
          response => (
            console.log(response),
            this.response.id = response.data.id,
            this.response.method = response.data.method,
            this.response.url = response.data.url,
            this.response.statusCode =  response.data.statusCode,
            this.response.statusMessage = response.data.statusMessage,
            this.response.date =  response.data.date,
            this.response.redirects = response.data.redirects,
            this.response.pathname = response.data.pathname,
            this.response.domain = response.data.domain,
            this.response.httpVersion = response.data.httpVersion
          )
        )
        .catch(error => {
            console.log("here")
            console.log(error)
            if(error.response.status == 404){
              this.response.addressnotfound = true,
              console.log("address not found")
            }
            if(error.response.status == 400){
              this.response.addressnotvalid = true,
              console.log("address not valid")
            }
            if(error.response.status >= 500){
              console.log(error)
              this.$router.push('/NotWorking')
            }

        });
      }
    }
  }
</script>

<style>
  #method{
   height: 40px;
   width: 100px;
   margin-right: 10px;
  }

  #url{
    height: 40px;
    width: 500px;
  }

  #button{
    height: 40px;
    width: 100px;
    margin-left: 10px;
  }

  #input-group-1 {
    background-color: #f2f2f2;
    height: 100px;
    width: 800px;
    margin: auto;
    margin-bottom: 50px;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
  }

  #cardsRight {
    height: 120px;
    width: 300px;
    margin-left:auto;
    font-size: 14px;
    margin-bottom: 150px;
  }

  #cards {
    height: 120px;
    width: 300px;
    font-size: 14px;
    margin-bottom: 150px;

  }

  #cardsLeft {
    height: 120px;
    width: 300px;
    margin-right:auto;
    font-size: 14px;
    margin-bottom: 150px;
  }

  #cardsText{
    text-align:left;
    font-size: 14px;

  }

  #linkbutton{
    height: 40px;
    width: fit-content;
    background-color: #e7e7e7;
    color: black;
    border: none;
    text-align: center;
    border-radius: 12px;
    margin: auto;
    align-items: center;
    justify-content: center;
  }

</style>
