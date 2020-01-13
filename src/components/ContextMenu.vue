<template>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <slot name="menuItem"></slot>
    </ul>
</template>
<script>
    export default {
        name: 'ContextMenu',
        props: {
            offset: {
                type: Object,
                default: () => {
                    return {
                        clientX: 0,
                        clientY: 0
                    }
                }
            },
            visible : {
                type :Boolean,
                default :false
            }
        },
        data() {
            return {
                left: 0,
                top: 0,
            }
        },
        watch: {
            offset: {
                handler: function () {
                    const {
                        clientX,
                        clientY
                    } = this.offset
                    this.top = clientY;
                    this.left = clientX;
                },
                deep: true
            },
            visible(value) {
                var that = this;
                if (value) {
                    document.body.addEventListener('click', function(){
                        that.$emit('clearMenus')
                    });
                } else {
                    document.body.removeEventListener('click', function(){
                        that.$emit('clearMenus')
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    }

    .contextmenu li {
        min-width: 200px;
        font-size: 14px;
        list-style-type: none;
        margin: 0;
        padding: 7px 16px;
        color: #666;
        cursor: pointer;
    }

    .contextmenu li:hover {
        background: #eee;
    }
</style>