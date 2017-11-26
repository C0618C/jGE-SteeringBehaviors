class UT{
    static Auto_Test(x){
        
    }

    static Seek(x){
        let obj = new MoveObj();
        obj.Seek(new Vector2D(500,300))
        x.add(obj);

        window.o = obj;
        window.j = x;
    }
  
}

(function(){
    ;
})();