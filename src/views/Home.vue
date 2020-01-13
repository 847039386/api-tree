<template >
    <div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  computed: {
      ...mapState({MDefaultProject : state => state.Project.defaultProject})
  },
  created : function(){
      if(this.MDefaultProject._id){
            this.$router.push({
                path: '/project/tree',
                query: {
                    id: this.MDefaultProject._id
                }
            })
      }else{
            this.$router.push({ path: '/project/list'})
      }
  }
}
</script>