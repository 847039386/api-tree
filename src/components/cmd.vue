<template>
    <q-footer elevated class="bg-white cmdcomponent" v-show="cmd.status != -1">
            <q-bar class="bg-dark">
                <q-icon name="laptop_chromebook" />
                <div>控制台</div>
                <q-space />

                <q-btn @click="onHide" dense flat icon="minimize" />
                <q-btn @click="onShow" dense flat icon="crop_square" />
                <q-btn @click="onClose" dense flat icon="close" />
            </q-bar>
            <q-scroll-area
                :thumb-style="thumbStyle()"
                :content-style="contentStyle()"
                :content-active-style="contentActiveStyle()"
                style="height: 200px;"
                v-show="cmd.status == 1"
            >
            <p style="padding:10px;color:#000;margin:0;" v-for="(data ,idx) in cmd.datas" :key="'cmdid' + idx">
                <span :class="data.color">{{ data.content }}</span>
            </p>
        </q-scroll-area>
    </q-footer>
</template>
<style>
 
</style>
<script>
    import { mapState } from 'vuex'
    export default {
    name: 'cmdCompontent',
    components : {  },
    props :{
        
    },
    computed :{
        ...mapState({ cmd : state => state.Cmd })
    },
    data() {
        return {
            contentStyle () {
                return {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: '#555'
                }
            },

            contentActiveStyle () {
                return {
                    backgroundColor: '#eee',
                    color: 'black'
                }
            },

            thumbStyle () {
                return {
                    right: '2px',
                    borderRadius: '5px',
                    backgroundColor: '#027be3',
                    width: '5px',
                    opacity: 0.75
                }
            }
        }
    },
    created :function(){

    },
    methods : {
        onHide :function(){
            this.$store.dispatch('Cmd/status','hide');
        },
        onClose :function(){
            this.$store.dispatch('Cmd/status','close');
        },
        onShow :function(){
            this.$store.dispatch('Cmd/status','show');
        }
    },
  };
</script>

<style>
    .cmdcomponent > .absolute-full {top:0 ! important;}
</style>
